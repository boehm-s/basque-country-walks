const ensureAuth = (req, res, next) => {
    if (!global.AUTHORIZED_IDS.includes(req.headers.authorization)) {
	    return res.status(401).end(`You are not authorized to perform such operation !`);
    }

    return next();
};

export default {ensureAuth};
