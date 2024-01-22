echo "Executing migrations..."
npx prisma migrate dev

echo "Starting server..."
node main.js