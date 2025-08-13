#!/usr/bin/env node

// Seed script to populate assessments with Judge0 test cases
import { seedDatabase } from '../server/seed-data.js';

async function runSeed() {
  console.log("🌱 Starting database seeding...");
  
  try {
    await seedDatabase();
    console.log("✅ Database seeded successfully!");
    console.log("📝 Added comprehensive coding assessments with Judge0 integration");
    console.log("🔧 Test cases include:");
    console.log("   • Easy: Two Sum, Valid Parentheses, Merge Two Lists");
    console.log("   • Medium: Maximum Subarray, Merge Intervals, 3Sum");
    console.log("   • Advanced: BST Validation, Container With Most Water");
    console.log("🚀 Judge0 API integration supports 40+ programming languages");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeed();