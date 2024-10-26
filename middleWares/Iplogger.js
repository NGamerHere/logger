function IpLogger(req, res, next) {
    const Ipaddress = req.headers['x-forwarded-for'] || req.ip;
    const route = req.route ? req.route.path : req.originalUrl;
    console.log(`${Ipaddress} - request ${req.method} at ${route}`);
    next();
}

export default IpLogger;
