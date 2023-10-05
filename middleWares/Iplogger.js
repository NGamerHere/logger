function IpLogger(req,res,next){
    const Ipaddress=req.ip;
    console.log(Ipaddress);
    next();
}
export default IpLogger;