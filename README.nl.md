# Code Review Plugin

Geautomatiseerde codereview voor pull requests met behulp van meerdere gespecialiseerde agents met op vertrouwen gebaseerde scores om vals-positieven te filteren.

## Overzicht

De Code Review Plugin automatiseert pull request reviews door meerdere agents parallel te lanceren om onafhankelijk wijzigingen vanuit verschillende perspectieven te controleren. Het gebruikt op vertrouwen gebaseerde scores om vals-positieven eruit te filteren, zodat alleen hoogwaardige, bruikbare feedback wordt geplaatst.

## Commando's

### '/code-review'

Voert geautomatiseerde codereview uit op een pull request met behulp van meerdere gespecialiseerde agents.

**Wat het doet:**
1. Controleert of review nodig is (slaagt gesloten, concept, triviale of reeds beoordeelde PR's over)
2. Verzamelt relevante CLAUDE.md richtlijn bestanden uit de repository
3. Vat de wijzigingen in het pull request samen
4. Lanceert 4 parallelle agents om onafhankelijk te beoordelen:
   - **Agents #1 & #2**: Controleren op CLAUDE.md compliance
   - **Agent #3**: Scant op duidelijke bugs in wijzigingen
   - **Agent #4**: Analyseert git blame/geschiedenis voor context-gebaseerde problemen
5. Scoort elk probleem 0-100 voor het vertrouwensniveau
6. Filtert problemen onder de 80 vertrouwensdrempel eruit
7. Voert de review uit (standaard naar de terminal, of als PR-commentaar met de '--comment' vlag)

**Gebruik:**
'''bash
/code-review [--comment]
'''

**Opties:**
 - '--comment': Plaats de review als een commentaar op het pull request (standaard: alleen uitvoer naar terminal)

**Voorbeeld workflow:**
'''bash
# Op een PR-branch, lokaal uitvoeren (uitvoer naar terminal):
/code-review

# Plaats review als PR-commentaar:
/code-review --comment

# Claude zal:
# - 4 review agents parallel lanceren
# - Elk probleem scoren op vertrouwen
# - Problemen ≥80 vertrouwen uitvoeren (naar terminal of PR afhankelijk van vlag)
# - Overslaan als er geen problemen met hoge mate van vertrouwen zijn gevonden
'''

**Functies:**
 - Meerdere onafhankelijke agents voor een uitgebreide review
 - Op vertrouwen gebaseerde scores verminderen vals-positieven (drempel: 80)
 - CLAUDE.md compliance controle met expliciete richtlijn verificatie
 - Bugdetectie gericht op wijzigingen (niet op reeds bestaande problemen)
 - Historische contextanalyse via git blame
 - Automatisch overslaan van gesloten, concept of reeds beoordeelde PR's
 - Links direct naar code met volledige SHA en regelbereiken

**Review commentaar formaat:**
'''markdown
## Codereview

3 problemen gevonden:

1. Ontbrekende foutafhandeling voor OAuth callback (CLAUDE.md zegt: Altijd OAuth-fouten afhandelen)

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L67-L72

2. Geheugenlek: OAuth-status niet opgeschoond (bug door ontbrekende opschoning in finally-blok)

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L88-L95

3. Inconsistent naamgevingspatroon (src/conventions/CLAUDE.md zegt: Gebruik camelCase voor functies)

https://github.com/owner/repo/blob/abc123.../src/utils.ts#L23-L28
'''

**Vertrouwensscore:**
 - **0**: Niet zeker, vals-positief
 - **25**: Enigszins zeker, zou echt kunnen zijn
 - **50**: Redelijk zeker, echt maar klein
 - **75**: Zeer zeker, echt en belangrijk
 - **100**: Absoluut zeker, absoluut echt

**Vals-positieven gefilterd:**
 - Reeds bestaande problemen die niet in de PR zijn geïntroduceerd
 - Code die eruitziet als een bug, maar het niet is
 - Pedante pietluttigheden
 - Problemen die linters zullen opvangen
 - Algemene kwaliteitsproblemen (tenzij in CLAUDE.md)
 - Problemen met lint ignore comments

## Installatie

Deze plugin is opgenomen in de Claude Code repository. Het commando is automatisch beschikbaar bij gebruik van Claude Code.

## Best Practices

### Gebruik van '/code-review'
 - Houd duidelijke CLAUDE.md bestanden bij voor betere compliance controle
 - Vertrouw op de 80+ vertrouwensdrempel - vals-positieven worden gefilterd
 - Uitvoeren op alle niet-triviale pull requests
 - Beoordeel de bevindingen van de agent als startpunt voor menselijke review
 - Update CLAUDE.md op basis van terugkerende reviewpatronen

### Wanneer te gebruiken
 - Alle pull requests met zinvolle wijzigingen
 - PR's die kritieke codepaden aanraken
 - PR's van meerdere bijdragers
 - PR's waar richtlijn compliance belangrijk is

### Wanneer niet te gebruiken
 - Gesloten of concept PR's (worden sowieso automatisch overgeslagen)
 - Triviale geautomatiseerde PR's (worden automatisch overgeslagen)
 - Dringende hotfixes die onmiddellijke merge vereisen
 - Reeds beoordeelde PR's (worden automatisch overgeslagen)

## Workflow Integratie

### Standaard PR review workflow:
'''bash
# Maak PR met wijzigingen
# Voer lokale review uit (uitvoer naar terminal)
/code-review

# Beoordeel de geautomatiseerde feedback
# Voer eventuele noodzakelijke fixes uit

# Optioneel plaatsen als PR-commentaar
/code-review --comment

# Merge wanneer klaar
'''

### Als onderdeel van CI/CD:
'''bash
# Trigger bij PR-creatie of -update
# Gebruik --comment vlag om review commentaren te plaatsen
/code-review --comment
# Overslaan als review al bestaat
'''

## Vereisten

 - Git repository met GitHub-integratie
 - GitHub CLI ('gh') geïnstalleerd en geauthenticeerd
 - CLAUDE.md bestanden (optioneel maar aanbevolen voor richtlijncontrole)

## Probleemoplossing

### Review duurt te lang

**Probleem**: Agents zijn traag bij grote PR's

**Oplossing**:
 - Normaal voor grote wijzigingen - agents draaien parallel
 - 4 onafhankelijke agents zorgen voor grondigheid
 - Overweeg om grote PR's op te splitsen in kleinere

### Te veel vals-positieven

**Probleem**: Review markeert problemen die niet echt zijn

**Oplossing**:
 - Standaarddrempel is 80 (filtert de meeste vals-positieven al)
 - Maak CLAUDE.md specifieker over wat belangrijk is
 - Overweeg of het gemarkeerde probleem daadwerkelijk geldig is

### Geen review commentaar geplaatst

**Probleem**: '/code-review' wordt uitgevoerd, maar er verschijnt geen commentaar

**Oplossing**:
Controleer of:
 - PR is gesloten (reviews overgeslagen)
 - PR is concept (reviews overgeslagen)
 - PR is triviaal/geautomatiseerd (reviews overgeslagen)
 - PR heeft al een review (reviews overgeslagen)
 - Geen problemen gescoord ≥80 (geen commentaar nodig)

### Linkopmaak is kapot

**Probleem**: Codelinks worden niet correct weergegeven in GitHub

**Oplossing**:
Links moeten dit exacte formaat volgen:
'''
https://github.com/owner/repo/blob/[full-sha]/path/file.ext#L[start]-L[end]
'''
 - Moet volledige SHA gebruiken (niet afgekort)
 - Moet '#L' notatie gebruiken
 - Moet regelbereik met ten minste 1 regel context bevatten

### GitHub CLI werkt niet

**Probleem**: 'gh' commando's mislukken

**Oplossing**:
 - Installeer GitHub CLI: 'brew install gh' (macOS) of zie [GitHub CLI installatie](https://cli.github.com/)
 - Authenticeer: 'gh auth login'
 - Controleer of de repository een GitHub remote heeft

## Tips

 - **Schrijf specifieke CLAUDE.md bestanden**: Duidelijke richtlijnen = betere reviews
 - **Voeg context toe aan PR's**: Helpt agents intentie te begrijpen
 - **Gebruik vertrouwensscores**: Problemen ≥80 zijn meestal correct
 - **Itereer op richtlijnen**: Update CLAUDE.md op basis van patronen
 - **Review automatisch**: Stel in als onderdeel van de PR-workflow
 - **Vertrouw op de filtering**: Drempel voorkomt ruis

## Configuratie

### Vertrouwensdrempel aanpassen

De standaarddrempel is 80. Om aan te passen, wijzig het commandobestand op 'commands/code-review.md':
'''markdown
Filter alle problemen met een score lager dan 80 eruit.
'''

Wijzig '80' naar uw voorkeursdrempel (0-100).

### Reviewfocus aanpassen

Bewerk 'commands/code-review.md' om agenttaken toe te voegen of te wijzigen:
 - Voeg beveiligingsgerichte agents toe
 - Voeg prestatieanalyse agents toe
 - Voeg toegankelijkheidscontrole agents toe
 - Voeg documentatiekwaliteitscontroles toe

## Technische Details

### Agent architectuur
 - **2x CLAUDE.md compliance agents**: Redundantie voor richtlijncontroles
 - **1x bugdetector**: Gericht op duidelijke bugs in alleen wijzigingen
 - **1x geschiedenisanalysator**: Context van git blame en geschiedenis
 - **Nx vertrouwensscorers**: Eén per probleem voor onafhankelijke scoring

### Scoringssysteem
 - Elk probleem wordt onafhankelijk gescoord 0-100
 - Scoring houdt rekening met bewijskracht en verificatie
 - Drempel (standaard 80) filtert problemen met laag vertrouwen
 - Voor CLAUDE.md problemen: verifieert of de richtlijn het expliciet vermeldt

### GitHub-integratie
Gebruikt 'gh' CLI voor:
 - Bekijken van PR-details en diffs
 - Ophalen van repositorygegevens
 - Lezen van git blame en geschiedenis
 - Plaatsen van review commentaren

## Auteur

Boris Cherny (boris @anthropic.com)

## Versie

1.0.0
