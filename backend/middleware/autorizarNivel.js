/*module.exports = function autorizarNivel(...niveisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !niveisPermitidos.includes(req.usuario.nivel)) {
            return res.status(403).json({ mensagem: 'Acesso negado.' });
        }
        next();
    };
};*/

// autorizarNivel.js
export default function autorizarNivel(...niveisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !niveisPermitidos.includes(req.usuario.nivel)) {
            return res.status(403).json({ mensagem: 'Acesso negado.' });
        }
        next();
    };
}
