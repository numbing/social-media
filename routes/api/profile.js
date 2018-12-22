const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const validatorProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route GET api/profile/test
// @access Public

router.get("/test", (req, res) =>
    res.json({
        msg: "profile works"
    })
);

// @route GET api/profile/all
// get all profiles

router.get("/all", (req, res) => {
    const errors = {};
    Profile.find()
        .populate("user", ["name", "avatar"])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = "there are no profiles";
                return res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch(err =>
            res.status(404).json({
                profile: "there is no profiles"
            })
        );
});

// @route GET api/profile/handle/:handle
// Get current users profile
// access private
router.get("/handle/:handle", (req, res) => {
    const errors = {};
    Profile.findOne({
            handle: req.params.handle
        })
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "there is no profile for this user";
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route GET api/profile/user/:user_id
// Get current users profile
// access private

router.get("/user/:user_id", (req, res) => {
    const errors = {};
    Profile.findOne({
            user: req.params.user_id
        })
        .populate("user", ["name", "avatar"])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "there is no profile for this userrrrrrr";
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err =>
            res.status(404).json({
                profile: "there is no profile for this user"
            })
        );
});

router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const errors = {};
        Profile.findOne({
                user: req.user.id
            })
            .populate("user", ["name", "avatar"])
            .then(profile => {
                if (!profile) {
                    errors.noprofile = "There is no profile for this user";
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

//GET api/profile/handle/:handle
// publick for profiles

//POST api / profile
// Cteate or edit user Profile
// access private

router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validatorProfileInput(req.body);

        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const profileFields = {};
        profileFields.user = req.user.id;

        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) {
            profileFields.githubusername = req.body.githubusername;
        }
        //skills - split into array
        if (typeof req.body.skills !== "undefined") {
            profileFields.skills = req.body.skills.split(",");
        }

        //social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            if (profile) {
                //update
                Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(profile => res.json(profile));
            } else {
                // Create

                //Check if handle exists

                Profile.findOne({
                    handle: profileFields.handle
                }).then(profile => {
                    if (profile) {
                        errors.handle = "That handle already exists";
                        res.status(400).json(errors);
                    }

                    //Save Profile
                    new Profile(profileFields).save().then(profile => res.json(profile));
                });
            }
        });
    }
);

//route POST api/profile/experience
//Private route

router.post(
    "/experience",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {

        const {
            errors,
            isValid
        } = validateExperienceInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors)
        }


        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            //add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        });
    }
);

//Route POST api/profile/education


router.post(
    "/education",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {

        const {
            errors,
            isValid
        } = validateEducationInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors)
        }


        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };
            //add to exp array
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        });
    }
);

//Route POST api/profile/experience/:exp_id
// Delete experience from Profile



router.delete(
    "/experience/:exp_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {

        Profile.findOne({
                user: req.user.id
            }).then(profile => {
                // Get remove index
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);

                //Splice out of array
                profile.experience.splice(removeIndex, 1);
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
);

router.delete(
    "/education/:edu_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {

        Profile.findOne({
                user: req.user.id
            }).then(profile => {
                // Get remove index
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexOf(req.params.edu_id);

                //Splice out of array
                profile.education.splice(removeIndex, 1);
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json(err));
    }
);

//Route POST api/profile
// Delete User and Profile


router.delete(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOneAndRemove({
            user: req.user.id
        }).then(() => {
            User.findOneAndRemove({
                _id: req.user.id
            }).then(() => res.json({
                success: true
            }))
        })

    }
);


module.exports = router;