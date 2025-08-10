// server/routes/recommender.js
import express from "express";
import { recommendForTopics, seedResources, getAllResources } from "../agents/recommenderAgent.js";
import { analyzeWeakSkills, generateRecommendations } from "../agents/profileAgent.js";

const router = express.Router();

// GET /learning-path?topics=python,recursion&k=5
router.get("/learning-path", async (req, res) => {
  try {
    const topicsRaw = req.query.topics || "";
    const k = parseInt(req.query.k || "5", 10);
    const topics = topicsRaw.split(",").map(t => t.trim()).filter(Boolean);
    
    const items = await recommendForTopics(topics, k);
    return res.json({ ok: true, items });
  } catch (err) {
    console.error("Error in learning path recommendation:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /learning-path/personalized - Get personalized recommendations based on user's weak skills
router.get("/learning-path/personalized", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ ok: false, error: "Authentication required" });
    }

    // Get user's assessment history from storage
    const userAssessments = await req.app.locals.storage.getUserAssessments(userId);
    const weakSkills = analyzeWeakSkills(userAssessments, []);
    
    // Generate personalized recommendations
    const recommendations = await generateRecommendations(userId, weakSkills, 'intermediate');
    
    // Also get AI-powered recommendations for weak skills
    const aiRecommendations = await recommendForTopics(weakSkills, 3);
    
    const combinedRecommendations = [
      ...recommendations.map(r => ({ ...r, source: 'profile_analysis' })),
      ...aiRecommendations.map(r => ({ ...r, source: 'ai_matching' }))
    ].slice(0, 8);

    return res.json({ 
      ok: true, 
      items: combinedRecommendations,
      weakSkills,
      userId 
    });
  } catch (err) {
    console.error("Error in personalized recommendations:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /learning-path/seed - Seed the system with curated resources (admin)
router.post("/learning-path/seed", async (req, res) => {
  try {
    const resources = req.body.resources;
    if (!Array.isArray(resources)) {
      return res.status(400).json({ ok: false, error: "resources array expected" });
    }
    
    const added = await seedResources(resources);
    res.json({ ok: true, addedCount: added.length, resources: added });
  } catch (err) {
    console.error("Error seeding resources:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /learning-path/resources - Get all available resources
router.get("/learning-path/resources", async (req, res) => {
  try {
    const resources = getAllResources();
    res.json({ ok: true, resources });
  } catch (err) {
    console.error("Error getting resources:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;