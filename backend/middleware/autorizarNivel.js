
// autorizarNivel.js
export default function autorizarNivel(...niveisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(403).json({ mensagem: 'Acesso negado.' });
        }

        // Convertemos todos os níveis permitidos para números
        const niveisNumericos = niveisPermitidos.map(n => Number(n));

        // Também convertemos o nível do usuário para número para garantir comparações corretas
        const nivelUsuario = Number(req.usuario.nivel);

        if (!niveisNumericos.includes(nivelUsuario)) {
            return res.status(403).json({ mensagem: 'Acesso negado.' });
        }
        next();
    };
}
