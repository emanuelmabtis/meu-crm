import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("crm.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT UNIQUE,
    type TEXT DEFAULT 'individual', -- 'individual' or 'group'
    status TEXT DEFAULT 'lead',
    last_message TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id TEXT,
    content TEXT,
    sender TEXT, -- 'user' or 'bot' or 'client'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id)
  );

  CREATE TABLE IF NOT EXISTS kanban_stages (
    id TEXT PRIMARY KEY,
    name TEXT,
    position INTEGER
  );

  CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY,
    contact_id TEXT,
    title TEXT,
    value REAL,
    stage_id TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(contact_id) REFERENCES contacts(id),
    FOREIGN KEY(stage_id) REFERENCES kanban_stages(id)
  );

  CREATE TABLE IF NOT EXISTS bot_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    system_instruction TEXT,
    is_active BOOLEAN DEFAULT 1
  );
`);

// Seed initial data if empty
const stagesCount = db.prepare("SELECT COUNT(*) as count FROM kanban_stages").get() as { count: number };
if (stagesCount.count === 0) {
  const insertStage = db.prepare("INSERT INTO kanban_stages (id, name, position) VALUES (?, ?, ?)");
  insertStage.run("lead", "Lead", 0);
  insertStage.run("contact", "Contato Inicial", 1);
  insertStage.run("negotiation", "Negociação", 2);
  insertStage.run("closed", "Fechado", 3);
}

const configCount = db.prepare("SELECT COUNT(*) as count FROM bot_config").get() as { count: number };
if (configCount.count === 0) {
  db.prepare("INSERT INTO bot_config (id, system_instruction, is_active) VALUES (1, 'Você é um assistente de vendas humanizado e prestativo.', 1)").run();
}

// Seed some contacts and deals
const contactsCount = db.prepare("SELECT COUNT(*) as count FROM contacts").get() as { count: number };
if (contactsCount.count === 0) {
  const insertContact = db.prepare("INSERT INTO contacts (id, name, phone, type, status) VALUES (?, ?, ?, ?, ?)");
  insertContact.run("1", "João Silva", "5511999999999", "individual", "lead");
  insertContact.run("2", "Maria Oliveira", "5511888888888", "individual", "contact");
  insertContact.run("3", "Grupo de Vendas", "123456789@g.us", "group", "negotiation");

  const insertDeal = db.prepare("INSERT INTO deals (id, contact_id, title, value, stage_id, description) VALUES (?, ?, ?, ?, ?, ?)");
  insertDeal.run("d1", "1", "Projeto Website", 5000, "lead", "Desenvolvimento de site institucional");
  insertDeal.run("d2", "2", "Consultoria CRM", 2500, "negotiation", "Implantação de ZapCRM");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/contacts", (req, res) => {
    const contacts = db.prepare("SELECT * FROM contacts ORDER BY updated_at DESC").all();
    res.json(contacts);
  });

  app.post("/api/contacts", (req, res) => {
    const { id, name, phone, type } = req.body;
    try {
      db.prepare("INSERT INTO contacts (id, name, phone, type) VALUES (?, ?, ?, ?)").run(id, name, phone, type);
      res.status(201).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Contact already exists or invalid data" });
    }
  });

  app.get("/api/kanban", (req, res) => {
    const stages = db.prepare("SELECT * FROM kanban_stages ORDER BY position").all();
    const deals = db.prepare("SELECT d.*, c.name as contact_name FROM deals d JOIN contacts c ON d.contact_id = c.id").all();
    res.json({ stages, deals });
  });

  app.post("/api/deals", (req, res) => {
    const { id, contact_id, title, value, stage_id, description } = req.body;
    db.prepare("INSERT INTO deals (id, contact_id, title, value, stage_id, description) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, contact_id, title, value, stage_id, description);
    res.status(201).json({ success: true });
  });

  app.patch("/api/deals/:id", (req, res) => {
    const { stage_id } = req.body;
    db.prepare("UPDATE deals SET stage_id = ? WHERE id = ?").run(stage_id, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/bot-config", (req, res) => {
    const config = db.prepare("SELECT * FROM bot_config WHERE id = 1").get();
    res.json(config);
  });

  app.post("/api/bot-config", (req, res) => {
    const { system_instruction, is_active } = req.body;
    db.prepare("UPDATE bot_config SET system_instruction = ?, is_active = ? WHERE id = 1")
      .run(system_instruction, is_active ? 1 : 0);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
