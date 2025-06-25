function esPuppeteer(req) {
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    return userAgent.includes('puppeteer') || 
           userAgent.includes('headlesschrome') || 
           userAgent.includes('chrome/') && userAgent.includes('headless');
}

export const autenticado = (req, res, next) => {
    if (req.session.usuario || esPuppeteer(req)) {
        console.log('Usuario autenticado o es Puppeteer:', {
            tieneSession: !!req.session.usuario,
            esPuppeteer: esPuppeteer(req),
            userAgent: req.headers['user-agent']
        });
        return next();
    }
    res.redirect("/");
}