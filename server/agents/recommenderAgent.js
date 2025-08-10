// server/agents/recommenderAgent.js
import fetch from "node-fetch";

const HF_KEY = process.env.HUGGINGFACE_API_KEY;

// util: compute cosine similarity
function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

// call HF embedding model: sentence-transformers/all-MiniLM-L6-v2 (good, small)
async function getEmbedding(text) {
  if (!HF_KEY) throw new Error("HUGGINGFACE_API_KEY missing");
  const url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: text })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("HF embedding error: " + txt);
  }
  const j = await res.json();
  // HF returns array of embeddings for batch input, we want first one
  if (Array.isArray(j) && j.length > 0) {
    return Array.isArray(j[0]) ? j[0] : j;
  }
  throw new Error("Unexpected HF embedding response: " + JSON.stringify(j).slice(0,200));
}

// In-memory storage for demo (replace with real DB in production)
let resourcesStore = [];

// Save a resource with precomputed embedding
// resource = { id, title, url, type, description, tags }
async function addResource(resource) {
  if (!resource.id) resource.id = `res:${Date.now()}:${Math.random().toString(36).slice(2,8)}`;
  
  // build searchable text
  const text = `${resource.title}\n${resource.description || ""}\n${(resource.tags || []).join(" ")}`;
  
  try {
    const embedding = await getEmbedding(text);
    resource.embedding = embedding;
  } catch (error) {
    console.error("Error getting embedding for resource:", error);
    // Continue without embedding for fallback
    resource.embedding = null;
  }
  
  resourcesStore.push(resource);
  return resource;
}

// Recommend top k resources for a list of topics (weakSkills)
async function recommendForTopics(topics = [], k = 5) {
  if (!resourcesStore.length) {
    // Return curated fallback recommendations
    return getCuratedRecommendations(topics, k);
  }

  if (!HF_KEY) {
    // Simple keyword matching fallback
    return getKeywordMatchRecommendations(topics, k);
  }

  try {
    // make a single query text from topics
    const queryText = Array.isArray(topics) ? topics.join(" | ") : String(topics);
    const qEmb = await getEmbedding(queryText);

    // compute similarity to all resources
    const scored = resourcesStore
      .filter(r => r.embedding) // Only resources with embeddings
      .map(r => {
        const sim = cosineSim(qEmb, r.embedding);
        return { resource: r, score: sim };
      });

    scored.sort((a,b) => b.score - a.score);
    return scored.slice(0, k).map(s => ({ ...s.resource, score: s.score }));
  } catch (error) {
    console.error("Error in recommendation:", error);
    return getKeywordMatchRecommendations(topics, k);
  }
}

// Fallback: simple keyword matching
function getKeywordMatchRecommendations(topics, k) {
  const topicsLower = topics.map(t => t.toLowerCase());
  
  const scored = resourcesStore.map(r => {
    let score = 0;
    const searchText = `${r.title} ${r.description} ${(r.tags || []).join(" ")}`.toLowerCase();
    
    topicsLower.forEach(topic => {
      if (searchText.includes(topic)) {
        score += 1;
      }
    });
    
    return { resource: r, score };
  });
  
  scored.sort((a,b) => b.score - a.score);
  return scored.slice(0, k).map(s => ({ ...s.resource, score: s.score }));
}

// Curated recommendations when no resources are available
function getCuratedRecommendations(topics, k) {
  const curatedResources = [
    {
      id: "curated-1",
      title: "JavaScript Array Methods Complete Guide",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
      type: "article",
      description: "Comprehensive guide to JavaScript array methods including map, filter, reduce, and more.",
      tags: ["javascript", "arrays", "methods"],
      score: 0.9
    },
    {
      id: "curated-2", 
      title: "Python Data Structures Tutorial",
      url: "https://docs.python.org/3/tutorial/datastructures.html",
      type: "tutorial",
      description: "Official Python documentation covering lists, dictionaries, sets, and tuples.",
      tags: ["python", "data structures", "lists", "dictionaries"],
      score: 0.85
    },
    {
      id: "curated-3",
      title: "Recursion in Programming - FreeCodeCamp",
      url: "https://www.freecodecamp.org/news/recursion-in-programming/",
      type: "article", 
      description: "Learn recursion concepts with practical examples and exercises.",
      tags: ["recursion", "algorithms", "programming"],
      score: 0.8
    },
    {
      id: "curated-4",
      title: "Object-Oriented Programming Concepts",
      url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/",
      type: "tutorial",
      description: "Understanding OOP principles: encapsulation, inheritance, polymorphism, and abstraction.",
      tags: ["oop", "object oriented", "programming", "concepts"],
      score: 0.75
    },
    {
      id: "curated-5",
      title: "Algorithm Design and Analysis Course",
      url: "https://www.coursera.org/learn/algorithms-part1",
      type: "course",
      description: "Comprehensive course covering fundamental algorithms and data structures.",
      tags: ["algorithms", "data structures", "course", "analysis"],
      score: 0.7
    }
  ];

  // Filter by topic relevance if topics provided
  if (topics.length > 0) {
    const topicsLower = topics.map(t => t.toLowerCase());
    const filtered = curatedResources.filter(r => {
      const searchText = `${r.title} ${r.description} ${r.tags.join(" ")}`.toLowerCase();
      return topicsLower.some(topic => searchText.includes(topic));
    });
    
    if (filtered.length > 0) {
      return filtered.slice(0, k);
    }
  }

  return curatedResources.slice(0, k);
}

// Helper: allow seeding a list of curated resources (array)
async function seedResources(resourcesList) {
  const added = [];
  for (const r of resourcesList) {
    const addedRes = await addResource(r);
    added.push(addedRes);
  }
  return added;
}

// Get all stored resources
function getAllResources() {
  return resourcesStore;
}

// Clear all resources (for testing)
function clearResources() {
  resourcesStore = [];
}

export { 
  addResource, 
  recommendForTopics, 
  seedResources, 
  getEmbedding,
  getAllResources,
  clearResources
};