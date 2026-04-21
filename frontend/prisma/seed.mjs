import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ablate.ai" },
    update: {
      name: "Ablate Admin",
      role: "admin",
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Ablate Admin",
      email: "admin@ablate.ai",
      role: "admin",
      passwordHash: adminPasswordHash,
    },
  });

  const modelsSeed = [
    { name: "Ablate-LM", version: "v4.2.1", ownerTeam: "Core AI", status: "active" },
    { name: "RiskSentinel", version: "v2.9.0", ownerTeam: "Safety", status: "active" },
    { name: "ContextRAG", version: "v1.8.4", ownerTeam: "Search", status: "staging" },
  ];

  const models = [];
  for (const modelInput of modelsSeed) {
    const model = await prisma.aIModel.upsert({
      where: {
        name_version: {
          name: modelInput.name,
          version: modelInput.version,
        },
      },
      update: {
        ownerTeam: modelInput.ownerTeam,
        status: modelInput.status,
      },
      create: modelInput,
    });
    models.push(model);
  }

  if (models.length > 0) {
    const firstModel = models[0];

    const request = await prisma.unlearningRequest.create({
      data: {
        requestedById: admin.id,
        modelId: firstModel.id,
        datasetRef: "customer-support-embeddings-2026-01",
        reason: "GDPR erasure request for user cohort #A77",
        priority: "high",
        status: "running",
      },
    });

    await prisma.unlearningJob.create({
      data: {
        requestId: request.id,
        status: "running",
        progress: 62,
        startedAt: new Date(Date.now() - 1000 * 60 * 12),
        summary: "Shard sanitization and replay validation in progress.",
      },
    });
  }

  for (const model of models) {
    await prisma.riskMetric.create({
      data: {
        modelId: model.id,
        piiExposure: Math.random() * 0.01,
        biasScore: 0.08 + Math.random() * 0.1,
        leakageRisk: 0.04 + Math.random() * 0.12,
      },
    });

    await prisma.report.create({
      data: {
        modelId: model.id,
        title: `${model.name} ${model.version} Compliance Summary`,
        status: "ready",
        url: `/reports/${model.name.toLowerCase()}-${model.version}.pdf`,
        generatedAt: new Date(),
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
