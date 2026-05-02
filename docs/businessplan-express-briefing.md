# Businessplan Express - Komplettes Briefing

Landing Page + Supabase + Netlify Functions

## Was wir bauen

Eine cleane, weisse Landing Page fuer einen Businessplan-Service.
Kunden fuellen ein Formular aus, zahlen 149 EUR und bekommen innerhalb von 48 Stunden einen professionellen Businessplan plus Excel-Finanzplan.

### Phase 1: Semimanuell

- Landing Page live
- Formular speichert Anfrage in Supabase
- E-Mail-Benachrichtigung an Tarik
- Tarik liefert manuell per E-Mail

### Phase 2: Automatisiert, spaeter

- Stripe-Zahlung
- Claude API generiert Businessplan
- Automatischer Versand

## Tech Stack

```txt
Frontend:  Plain HTML + CSS + JS, kein Framework
Hosting:   Netlify, neues Repo oder Unterordner
Datenbank: Supabase
E-Mail:    Nodemailer via Netlify Function
Domain:    businessplan-express.de oder

```

## Supabase Tabellen

### SQL - alle Tabellen erstellen

```sql
-- Tabelle 1: Leads (Anfragen)
CREATE TABLE businessplan_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  telefon text,
  vorhaben text NOT NULL,
  branche text,
  zweck text, -- bankkredit/gruendungszuschuss/investor/kfw/eigenplanung/foerderung
  startkapital text,
  umsatzziel text,
  mitarbeiter text,
  status text DEFAULT 'neu', -- neu/in_bearbeitung/geliefert/bezahlt
  preis numeric DEFAULT 149,
  notizen text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabelle 2: Beispiel Businessplaene
CREATE TABLE businessplan_beispiele (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titel text NOT NULL,
  branche text,
  beschreibung text,
  pdf_url text,
  vorschau_bild_url text,
  aktiv boolean DEFAULT true,
  sort_order integer DEFAULT 999
);

-- Tabelle 3: Testimonials
CREATE TABLE businessplan_testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  beruf text,
  unternehmen text,
  text text NOT NULL,
  sterne integer DEFAULT 5,
  foto_url text,
  aktiv boolean DEFAULT true,
  sort_order integer DEFAULT 999
);

-- Tabelle 4: Bestellungen (Phase 2)
CREATE TABLE businessplan_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid REFERENCES businessplan_leads(id),
  betrag numeric DEFAULT 149,
  zahlungsmethode text, -- paypal/stripe
  zahlungsstatus text DEFAULT 'ausstehend', -- ausstehend/bezahlt/erstattet
  businessplan_url text,
  excel_url text,
  geliefert_am timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS aktivieren
ALTER TABLE businessplan_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE businessplan_beispiele ENABLE ROW LEVEL SECURITY;
ALTER TABLE businessplan_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE businessplan_orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "public insert leads" ON businessplan_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "anon read beispiele" ON businessplan_beispiele FOR SELECT USING (true);
CREATE POLICY "anon read testimonials" ON businessplan_testimonials FOR SELECT USING (aktiv = true);
CREATE POLICY "service read leads" ON businessplan_leads FOR SELECT USING (true);

-- Demo Daten: Beispiel Businessplaene
INSERT INTO businessplan_beispiele (titel, branche, beschreibung, sort_order) VALUES
('Online Shop', 'E-Commerce', 'Businessplan fuer einen Online-Shop mit physischen Produkten. Enthaelt Marktanalyse, Finanzplan und Marketingstrategie.', 1),
('Dienstleistung', 'Beratung & Services', 'Businessplan fuer ein Beratungsunternehmen oder Freelancer. Ideal fuer Gruendungszuschuss bei der Arbeitsagentur.', 2),
('Gastronomie', 'Restaurant & Cafe', 'Businessplan fuer ein Restaurant oder Cafe. Enthaelt Standortanalyse, Konzept und detaillierte Kalkulation.', 3);

-- Demo Daten: Testimonials
INSERT INTO businessplan_testimonials (name, beruf, unternehmen, text, sterne, sort_order) VALUES
('Sarah M.', 'Gruenderin', 'Online Shop Frankfurt', 'Innerhalb von 48 Stunden hatte ich einen professionellen Businessplan der meiner Bank sofort ueberzeugt hat. Absolut empfehlenswert!', 5, 1),
('Marcus K.', 'Selbststaendiger Berater', 'MK Consulting', 'Der Businessplan war genau das was ich fuer meinen Gruendungszuschuss brauchte. Alles war bankfertig und professionell aufbereitet.', 5, 2),
('Lisa H.', 'Restaurantbesitzerin', 'Cafe Sonnenschein', 'Ich hatte keine Ahnung wie ich einen Businessplan schreiben soll. Das Team hat alles fuer mich erledigt - schnell, guenstig, professionell.', 5, 3);
```

## Dateistruktur

```txt
/businessplan/
  index.html             Haupt-Landing Page
  danke.html             Nach Formular-Submit

/netlify/functions/
  businessplan-lead.js   Formular verarbeiten + E-Mail
```

## Landing Page Aufbau

### Design-Vorgaben

- Farben: Weiss `#ffffff`, Schwarz `#1a1a1a`, Akzent Dunkelgruen `#204E3D`
- Font: Clean und modern, System-Font oder Google Font
- Stil: Minimal, professionell, vertrauenswuerdig
- Mobile First
- Kein Menue, nur Logo und CTA-Button oben

### Sektion 1 - Hero

- Logo: "Businessplan Express"
- H1: "Dein professioneller Businessplan in 48 Stunden"
- Subtext: "KI-gestuetzt, bankfertig und individuell fuer deine Geschaeftsidee - ohne wochenlangen Aufwand."
- CTA: "Jetzt Businessplan anfragen ->"
- Trust: "5 Sterne - Bereits 50+ Gruender geholfen"

### Sektion 2 - Problem/Lösung

Headline: "Der Businessplan ist die groesste Huerde beim Gruenden"

- Kein wochenlanger Aufwand mit Vorlagen
- Kein teurer Unternehmensberater, 3.000 EUR+
- Keine Ablehnung bei der Bank wegen schlechtem Plan

Loesung: "Wir erstellen deinen Businessplan - professionell, schnell und fuer nur 149 EUR"

### Sektion 3 - Wie es funktioniert

1. "Formular ausfuellen", 5 Minuten
2. "Wir erstellen deinen Plan", innerhalb von 48 Stunden
3. "Businessplan + Excel erhalten", per E-Mail

### Sektion 4 - Was du bekommst

- 15-20 Seiten professioneller Businessplan, PDF
- 3-Jahres-Finanzplan, Excel
- Executive Summary
- Marktanalyse
- Bankfertig und fuer Foerderantraege geeignet
- Unbegrenzte Ueberarbeitungen

Preis: 149 EUR einmalig  
Vergleich: Unternehmensberater 3.000 EUR+  
CTA Button: "Jetzt bestellen ->"

### Sektion 5 - Beispiel Businessplaene

Headline: "So sieht dein Businessplan aus"

3 Karten aus Supabase `businessplan_beispiele`:

- Titel
- Branche
- Beschreibung
- Button: "Vorschau ansehen", oeffnet PDF

### Sektion 6 - Testimonials

3 Bewertungen aus Supabase `businessplan_testimonials`:

- Name
- Beruf
- Sterne
- Text

### Sektion 7 - FAQ

FAQ als Accordion:

**Wie lange dauert die Erstellung?**  
Innerhalb von 48 Stunden nach Eingang deiner Anfrage, wenn du es schnell brauchst. Das würde dann bedeuten, dass wir einen Zuschlag von 149 Euro berechne 

**Fuer welche Zwecke ist der Businessplan geeignet?**  
Zuschuesse und Förderungen generell,Bankkredit, Gruendungszuschuss, KfW-Foerderung, Investor-Pitch und eigene Planung.

**Was passiert nach dem Absenden des Formulars?**  
Ich melde mich innerhalb von 24 Stunden mit Rueckfragen und Zahlungsinfos. Sie haben nur Kontakt zu mir und sonst niemandem. Außerdem werden Ihre Daten nicht weitergegeben.

**Kann ich Aenderungen anfordern?**  
Ja, ich überarbeite 2 mal den kompletten Plan. Dafür ist allerdings Mitarbeit gern gesehen. Je besser Sie mir einen Plan für die Überarbeitung ertsellen, desto schneller kommen wir an unser Ziel.

**In welchen Branchen habt ihr Erfahrung?**  
Einzelhandel, Gastronomie, Dienstleistung, E-Commerce, Handwerk. Im Prinzip können wir für jede Branche einen Businessplan erstellen. 

### Sektion 8 - Formular + CTA

Headline: "Jetzt Businessplan anfragen"  
Subtext: "Kostenlose Erstberatung - Antwort ab 499€ - kleinere Projekte die ich in 1-2 Tagen abarbeiten kann. Für Projekte die etwas länger dauern (das weiß ich aus Erfahrung) wird es in der Regel mehr aber nie über 1500 €."

Formularfelder:

- Name, Pflicht
- E-Mail, Pflicht
- Telefon, optional
- Vorhaben: Was moechtest du gruenden?, Textarea, Pflicht
- Branche: Einzelhandel, Gastronomie, Dienstleistung, E-Commerce, Handwerk, IT/Tech, Andere
- Zweck: Bankkredit/Finanzierung, Gruendungszuschuss Arbeitsagentur, Investor/Pitch, KfW-Foerderung, Eigene Planung, Andere Foerderung
- Startkapital: Unter 5.000 EUR, 5.000-20.000 EUR, 20.000-50.000 EUR, Ueber 50.000 EUR
- Umsatzziel Jahr 1: Unter 50.000 EUR, 50.000-100.000 EUR, 100.000-250.000 EUR, Ueber 250.000 EUR
- Mitarbeiter: Nur ich, 1-3, 4-10, Ueber 10

CTA Button: "Kostenlos anfragen ->"  
Hinweis: "Mit dem Absenden stimmst du unserer Datenschutzerklaerung zu."

### Footer

```txt
© 2026 Tarik Tosunoglu Unternehmensberatung - Businessplan - Förderungen - Zuschüsse
Impressum | Datenschutz
```

## Netlify Function: businessplan-lead.js

```javascript
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const {
      name, email, telefon, vorhaben,
      branche, zweck, startkapital,
      umsatzziel, mitarbeiter
    } = data;

    // Supabase Lead speichern
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    await supabase.from('businessplan_leads').insert({
      name, email, telefon, vorhaben,
      branche, zweck, startkapital,
      umsatzziel, mitarbeiter,
      status: 'neu'
    });

    // E-Mail an Tarik
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const now = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });

    await transporter.sendMail({
      from: `"Businessplan Express" <${process.env.GMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: `Neue Businessplan Anfrage: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#204E3D">Neue Anfrage!</h2>
          <table style="width:100%;font-size:15px">
            <tr><td style="color:#888;padding:8px 0">Name</td><td><b>${name}</b></td></tr>
            <tr><td style="color:#888;padding:8px 0">E-Mail</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="color:#888;padding:8px 0">Telefon</td><td>${telefon || '-'}</td></tr>
            <tr><td style="color:#888;padding:8px 0">Vorhaben</td><td>${vorhaben}</td></tr>
            <tr><td style="color:#888;padding:8px 0">Branche</td><td>${branche}</td></tr>
            <tr><td style="color:#888;padding:8px 0">Zweck</td><td>${zweck}</td></tr>
            <tr><td style="color:#888;padding:8px 0">Startkapital</td><td>${startkapital}</td></tr>
            <tr><td style="color:#888;padding:8px 0">Umsatzziel</td><td>${umsatzziel}</td></tr>
            <tr><td style="color:#888;padding:8px 0">Mitarbeiter</td><td>${mitarbeiter}</td></tr>
            <tr><td style="color:#888;padding:8px 0">Zeit</td><td>${now}</td></tr>
          </table>
          <p style="margin-top:20px;color:#888">
            Jetzt in Supabase ansehen und Businessplan erstellen!
          </p>
        </div>
      `
    });

    // Bestaetigungs-E-Mail an Kunden
    await transporter.sendMail({
      from: `"Businessplan Express" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Deine Anfrage ist eingegangen - Businessplan Express`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#204E3D">Vielen Dank, ${name}!</h2>
          <p>Deine Anfrage ist eingegangen. Wir melden uns
             innerhalb von 24 Stunden bei dir.</p>
          <p><b>Was passiert als naechstes?</b></p>
          <ol>
            <li>Wir pruefen deine Angaben</li>
            <li>Du erhaeltst eine Rechnung ueber 149 EUR</li>
            <li>Nach Zahlung starten wir mit deinem Businessplan</li>
            <li>Innerhalb von 48h erhaeltst du alles per E-Mail</li>
          </ol>
          <p style="color:#888;font-size:13px">
            Bei Fragen: ${process.env.GMAIL_USER}
          </p>
        </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
```

## Danke-Seite

- Grosses Success-Icon
- "Vielen Dank fuer deine Anfrage!"
- "Wir melden uns innerhalb von 24 Stunden."
- "Pruefe auch deinen Spam-Ordner."
- Button: "Zurueck zur Startseite ->"

## Netlify Environment Variables

```txt
SUPABASE_URL=https://dicltidzzwkmeeypwpqr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[Service Role Key]
GMAIL_USER=[Gmail Adresse]
GMAIL_APP_PASSWORD=[Gmail App Passwort]
NOTIFY_EMAIL=[Tarik's E-Mail]
```

## Deployment

### Option A: Unterordner in main-angebot Repo

- `/businessplan/index.html`
- URL: `ihr-solarangebot.de/businessplan`

### Option B: Neues Repo + neue Domain

- `businessplan-express.de`
- Separates Netlify-Projekt

Empfehlung: Option A, einfacher, schneller, kein neuer DNS.

## Google Ads Keywords, fuer spaeter

```txt
businessplan erstellen lassen
businessplan schreiben lassen
businessplan erstellen kosten
businessplan fuer bank
businessplan gruendungszuschuss
professioneller businessplan
businessplan 48 stunden
```

## Wichtige Hinweise fuer Cursor

- Design: weiss, clean, minimal, kein Solar-Branding
- Mobile First
- Kein Menue auf der Landing Page
- Formular Submit -> Netlify Function -> Supabase + E-Mail
- Nach Submit -> Weiterleitung auf `danke.html`
- Beispiele aus Supabase `businessplan_beispiele` laden
- Testimonials aus Supabase `businessplan_testimonials` laden
- FAQ als Accordion mit reinem CSS, kein Framework
- Ladezeit unter 2 Sekunden

## Noch nicht umsetzen

Dieses Dokument ist nur das Briefing. Umsetzung, Supabase-Schema, Netlify Function, Landing Page und Deployment werden erst nach gemeinsamer Abstimmung gestartet.
