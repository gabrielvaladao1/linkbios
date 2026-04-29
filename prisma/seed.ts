// SmartBio — Seed de desenvolvimento
//
// Cria usuários e links de exemplo para visualizar a /[slug] sem ter que
// passar pelo signup. Use apenas em ambiente local — NÃO rodar em produção.
//
// Como rodar:
//   npx tsx src/prisma/seed.ts
// (ou configurar `prisma.seed` no package.json e rodar `npx prisma db seed`)

import { PrismaClient, Plan } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seed bloqueado em produção.");
  }

  console.log("→ Limpando dados de seed antigos…");
  await prisma.linkClick.deleteMany({ where: { user: { email: { endsWith: "@seed.smartbio.local" } } } });
  await prisma.pageView.deleteMany({ where: { user: { email: { endsWith: "@seed.smartbio.local" } } } });
  await prisma.link.deleteMany({ where: { user: { email: { endsWith: "@seed.smartbio.local" } } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: "@seed.smartbio.local" } } });

  console.log("→ Criando usuário FREE de exemplo (joao)…");
  const joao = await prisma.user.create({
    data: {
      id: "11111111-1111-1111-1111-111111111111",
      email: "joao@seed.smartbio.local",
      slug: "joao",
      name: "João Pereira",
      bio: "Criador de conteúdo · Marketing digital · SP",
      whatsapp: "+5511999999999",
      plan: Plan.FREE,
      templateId: "minimal",
      colorBg: "#ffffff",
      colorButton: "#111111",
      colorText: "#ffffff",
      links: {
        create: [
          { title: "Meu Instagram",   url: "https://instagram.com/joao",  icon: "instagram", position: 0 },
          { title: "Meu YouTube",     url: "https://youtube.com/@joao",   icon: "youtube",   position: 1 },
          { title: "E-book grátis",   url: "https://exemplo.com/ebook",   icon: "download",  position: 2 },
          { title: "Curso completo",  url: "https://exemplo.com/curso",   icon: "graduation-cap", position: 3 },
        ],
      },
    },
  });

  console.log("→ Criando usuário PRO de exemplo (maria)…");
  const maria = await prisma.user.create({
    data: {
      id: "22222222-2222-2222-2222-222222222222",
      email: "maria@seed.smartbio.local",
      slug: "maria",
      name: "Maria Souza",
      bio: "Esteticista · Belo Horizonte",
      whatsapp: "+5531988888888",
      plan: Plan.PRO,
      templateId: "gradient",
      colorBg: "#fef3c7",
      colorButton: "#d97706",
      colorText: "#ffffff",
      hideBranding: true,
      links: {
        create: [
          { title: "Agendar consulta", url: "https://wa.me/5531988888888", icon: "calendar", position: 0 },
          { title: "Tabela de preços", url: "https://exemplo.com/precos",  icon: "tag",      position: 1 },
          { title: "Antes e depois",   url: "https://instagram.com/maria", icon: "image",    position: 2 },
        ],
      },
    },
  });

  console.log("→ Criando alguns pageviews/cliques sintéticos…");
  for (let i = 0; i < 50; i++) {
    await prisma.pageView.create({
      data: {
        userId: joao.id,
        referrer: i % 3 === 0 ? "https://instagram.com" : null,
        country: "BR",
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
      },
    });
  }

  const firstLink = await prisma.link.findFirst({ where: { userId: joao.id } });
  if (firstLink) {
    for (let i = 0; i < 20; i++) {
      await prisma.linkClick.create({
        data: {
          userId: joao.id,
          linkId: firstLink.id,
          createdAt: new Date(Date.now() - i * 30 * 60 * 1000),
        },
      });
    }
  }

  console.log("✓ Seed concluído. Slugs criados: /joao (FREE) e /maria (PRO).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
