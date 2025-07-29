import jwt from 'jsonwebtoken';

export function gerarToken(funcionario) {
  return jwt.sign(
    {
      email: funcionario.email,
      nivel: funcionario.nivel
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}
