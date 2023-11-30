import { PrismaClient } from '@prisma/client';
import Xray from 'x-ray';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const prisma = new PrismaClient();
const x = Xray();

if (
  !process.env.WEBSITE_URL ||
  !process.env.ANCHOR_ELEMENT ||
  !process.env.ITERATIVE_CLASS ||
  !process.env.NAME_CLASS ||
  !process.env.AREAS_CLASS ||
  !process.env.URL_CLASS ||
  !process.env.PAGINATE_CLASS
) {
  throw new Error('Not all environment variables are defined');
}

const Record = z.object({
  name: z.string(),
  areas: z.string().optional(),
  url: z.string()
});

const Records = z.array(Record);

x(process.env.WEBSITE_URL, process.env.ANCHOR_ELEMENT, {
  items: x(process.env.ITERATIVE_CLASS, [
    {
      name: process.env.NAME_CLASS,
      areas: process.env.AREAS_CLASS,
      url: process.env.URL_CLASS
    }
  ]).paginate(process.env.PAGINATE_CLASS)
})(async (err, data) => {
  if (err) {
    return console.log(err);
  }

  const safeData = Records.safeParse(data.items);
  if (!safeData.success) {
    const validationError = fromZodError(err as unknown as z.ZodError);
    console.log(validationError);
    return;
  }

  const allPromises = safeData.data.map(item => {
    return prisma.record.upsert({
      where: {
        url: item.url
      },
      create: {
        name: item.name.replace(/\t|\n/g, ''),
        areas: item.areas,
        url: item.url
      },
      update: {
        name: item.name.replace(/\t|\n/g, ''),
        areas: item.areas
      }
    });
  });

  await Promise.all(allPromises);

  const names = safeData.data.map(item => {
    return item.name.replace(/\t|\n/g, '');
  });

  console.log(names, `Found ${names.length} records.`);
});
