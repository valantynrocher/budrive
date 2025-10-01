import { execSync } from 'child_process';

module.exports = async () => {
  // Reset la DB de test à chaque exécution
  execSync('npx prisma migrate reset --force --skip-seed', {
    stdio: 'inherit',
  });
};
