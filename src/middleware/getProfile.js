const ProfileService = require("../services/ProfileService");

const getProfile = async (req, res, next) => {
    const profileId = req.get('profile_id') || 0;
    const profile = await ProfileService.getProfileById(profileId);
    if (!profile) return res.status(401).end();
    req.profile = profile;
    next();
};

module.exports = { getProfile };
