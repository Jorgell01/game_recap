import { PrismaClient } from "@prisma/client"; // Importa el cliente de Prisma para interactuar con la base de datos

// Crea una instancia del cliente de Prisma
const prisma = new PrismaClient();

// Exporta la instancia de Prisma para que pueda ser utilizada en otros archivos
export default prisma;

