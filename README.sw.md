# Programu-jalizi ya Ukaguzi wa Msimbo

Ukaguzi wa msimbo otomatiki kwa maombi ya kuvuta (pull requests) kwa kutumia mawakala wengi maalumu wenye alama za kujiamini ili kuchuja matokeho yasiyo sahihi (false positives).

## Muhtasari

Programu-jalizi ya Ukaguzi wa Msimbo huendesha ukaguzi wa maombi ya kuvuta kwa kuzindua mawakala wengi kwa wakati mmoja ili kukagua mabadiliko kwa uhuru kutoka mitazamo tofauti. Inatumia alama za kujiamini kuchuja matokeho yasiyo sahihi, kuhakikisha maoni ya hali ya juu na yanayoweza kutekelezwa pekee ndiyo yanayochapishwa.

## Amri

### '/code-review'

Hufanya ukaguzi wa msimbo otomatiki kwenye ombi la kuvuta kwa kutumia mawakala wengi maalumu.

**Inachofanya:**
1. Huangalia kama ukaguzi unahitajika (huruka PRs zilizofungwa, rasimu, zisizo muhimu, au zilizokaguliwa tayari)
2. Hukusanya faili muhimu za miongozo ya CLAUDE.md kutoka kwenye hazina (repository)
3. Hufupisha mabadiliko ya ombi la kuvuta
4. Huzindua mawakala 4 kwa wakati mmoja kukagua kwa uhuru:
   - **Mawakala #1 & #2**: Hukagua utiifu wa CLAUDE.md
   - **Wakali #3**: Huchanganua mabadiliko kwa ajili ya hitilafu dhahiri
   - **Wakali #4**: Huchanganua git blame/historia kwa masuala yanayotegemea muktadha
5. Huweka alama kila suala 0-100 kwa kiwango cha kujiamini
6. Huchuja masuala yaliyo chini ya kizingiti cha kujiamini cha 80
7. Hutoa ukaguzi (kwenye terminal kwa chaguo-msingi, au kama maoni ya PR kwa kutumia bendera ya '--comment')

**Matumizi:**
'''bash
/code-review [--comment]
'''

**Chaguo:**
 - '--comment': Chapisha ukaguzi kama maoni kwenye ombi la kuvuta (chaguo-msingi: hutoa kwenye terminal pekee)

**Mfano wa mtiririko wa kazi:**
'''bash
# Kwenye tawi la PR, endesha ndani (hutoa kwenye terminal):
/code-review

# Chapisha ukaguzi kama maoni ya PR:
/code-review --comment

# Claude ata:
# - Kuzindua mawakala 4 wa ukaguzi kwa wakati mmoja
# - Kuweka alama kila suala kwa kujiamini
# - Kutoa masuala yenye kujiamini ≥80 (kwenye terminal au PR kulingana na bendera)
# - Kuruka ikiwa hakuna masuala yenye kujiamini sana yaliyopatikana
'''

**Vipengele:**
 - Mawakala wengi huru kwa ukaguzi wa kina
 - Alama za kujiamini hupunguza matokeho yasiyo sahihi (kizingiti: 80)
 - Ukaguzi wa utiifu wa CLAUDE.md na uthibitishaji wa miongozo wazi
 - Utambuzi wa hitilafu unaozingatia mabadiliko (sio masuala yaliyopo tayari)
 - Uchambuzi wa muktadha wa kihistoria kupitia git blame
 - - Kuruka kiotomatiki kwa PRs zilizofungwa, rasimu, au zilizokaguliwa tayari
 - Viungo moja kwa moja kwenye msimbo na SHA kamili na safu za mistari

**Muundo wa maoni ya ukaguzi:**
'''markdown
## Ukaguzi wa msimbo

Masuala 3 yamepatikana:

1. Ukosefu wa ushughulikiaji wa hitilafu kwa callback ya OAuth (CLAUDE.md inasema Daima shughulikia hitilafu za OAuth)

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L67-L72

2. Kuvuja kwa kumbukumbu: Hali ya OAuth haijasafishwa (hitilafu kutokana na kukosekana kwa usafishaji katika block ya finally)

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L88-L95

3. Muundo wa majina usio thabiti (src/conventions/CLAUDE.md inasema Tumia camelCase kwa kazi)

https://github.com/owner/repo/blob/abc123.../src/utils.ts#L23-L28
'''

**Alama za kujiamini:**
 - **0**: Sina uhakika, matokea yasiyo sahihi
 - **25**: Nina uhakika kiasi, inaweza kuwa halisi
 - **50**: Nina uhakika wa wastani, halisi lakini dogo
 - **75**: Nina uhakika sana, halisi na muhimu
 - **100**: Nina uhakika kabisa, hakika halisi

**Matokeho yasiyo sahihi yaliyochujwa:**
 - Masuala yaliyopo tayari ambayo hayakuletwa kwenye PR
 - Msimbo unaoonekana kama hitilafu lakini sio
 - Ukosoaji mdogo usio na umuhimu
 - Masuala ambayo linters watayapata
 - Masuala ya jumla ya ubora (isipokuwa kama yamo kwenye CLAUDE.md)
 - Masuala yenye maoni ya kupuuza lint

## Usakinishaji

Programu-jalizi hii imejumuishwa kwenye hazina ya Claude Code. Amri inapatikana kiotomatiki unapotumia Claude Code.

## Mbinu Bora

### Kutumia '/code-review'
 - Dumisha faili wazi za CLAUDE.md kwa ukaguzi bora wa utiifu
 - Amini kizingiti cha kujiamini cha 80+ - matokeho yasiyo sahihi huchujwa
 - Endesha kwenye maombi yote ya kuvuta yasiyo madogo
 - Kagua matokea ya wakala kama mwanzo wa ukaguzi wa binadamu
 - Sasisha CLAUDE.md kulingana na mifumo ya ukaguzi inayojirudia

### Lini kutumia
 - Maombi yote ya kuvuta yenye mabadiliko yenye maana
 - PRs zinazogusa njia muhimu za msimbo
 - PRs kutoka kwa wachangiaji wengi
 - PRs ambapo utiifu wa miongozo ni muhimu

### Lini kutotumia
 - PRs zilizofungwa au rasimu (hurukwa kiotomatiki anyway)
 - PRs ndogo za kiotomatiki (hurukwa kiotomatiki)
 - Marekebisho ya haraka yanayohitaji kuunganishwa mara moja
 - PRs zilizokaguliwa tayari (hurukwa kiotomatiki)

## Ujumuishaji wa Mtiririko wa Kazi

### Mtiririko wa kazi wa kawaida wa ukaguzi wa PR:
'''bash
# Unda PR na mabadiliko
# Endesha ukaguzi wa ndani (hutoa kwenye terminal)
/code-review

# Kagua maoni ya kiotomatiki
# Fanya marekebisho yoyote muhimu

# Kwa hiari chapisha kama maoni ya PR
/code-review --comment

# Unganisha ukiwa tayari
'''

### Kama sehemu ya CI/CD:
'''bash
# Anzisha kwenye uundaji au sasisho la PR
# Tumia bendera ya --comment kuchapisha maoni ya ukaguzi
/code-review --comment
# Ruka ikiwa ukaguzi tayari upo
'''

## Mahitaji

 - Hazina ya Git yenye ujumuishaji wa GitHub
 - GitHub CLI ('gh') imesakinishwa na kuthibitishwa
 - Faili za CLAUDE.md (hiari lakini inapendekezwa kwa ukaguzi wa miongozo)

## Utatuzi wa Matatizo

### Ukaguzi unachukua muda mrefu sana

**Suala**: Mawakala ni polepole kwenye PRs kubwa

**Suluhisho**:
 - Ni kawaida kwa mabadiliko makubwa - mawakala huendesha kwa wakati mmoja
 - Mawakala 4 huru huhakikisha ukamilifu
 - Fikiria kugawanya PRs kubwa kuwa ndogo

### Matokeho yasiyo sahihi mengi sana

**Suala**: Ukaguzi huweka bendera kwenye masuala ambayo sio halisi

**Suluhisho**:
 - Kizingiti cha chaguo-msingi ni 80 (tayari huchuja matokeho mengi yasiyo sahihi)
 - Fanya CLAUDE.md iwe maalum zaidi kuhusu kile muhimu
 - Fikiria kama suala lililowekwa bendera ni halali kweli

### Hakuna maoni ya ukaguzi yaliyochapishwa

**Suala**: '/code-review' inaendesha lakini hakuna maoni yanayoonekana

**Suluhisho**:
Angalia kama:
 - PR imefungwa (ukaguzi hurukwa)
 - PR ni rasimu (ukaguzi hurukwa)
 - PR ni ndogo/ya kiotomatiki (ukaguzi hurukwa)
 - PR tayari ina ukaguzi (ukaguzi hurukwa)
 - Hakuna masuala yaliyowekwa alama ≥80 (hakuna maoni yanayohitajika)

### Muundo wa kiungo umevunjika

**Suala**: Viungo vya msimbo havitolewi kwa usahihi kwenye GitHub

**Suluhisho**:
Viungo lazima vifuatie muundo huu kamili:
'''
https://github.com/owner/repo/blob/[full-sha]/path/file.ext#L[start]-L[end]
'''
 - Lazima itumie SHA kamili (sio iliyofupishwa)
 - Lazima itumie nukuu ya '#L'
 - Lazima ijumuishe safu ya mistari na angalau mstari 1 wa muktadha

### GitHub CLI haifanyi kazi

**Suala**: Amri za 'gh' zinashindwa

**Suluhisho**:
 - Sakinisha GitHub CLI: 'brew install gh' (macOS) au angalia [usakinishaji wa GitHub CLI](https://cli.github.com/)
 - Thibitisha: 'gh auth login'
 - Thibitisha hazina ina GitHub remote

## Vidokezo

 - **Andika faili maalum za CLAUDE.md**: Miongozo wazi = ukaguzi bora
 - **Jumuisha muktadha katika PRs**: Husaidia mawakala kuelewa nia
 - **Tumia alama za kujiamini**: Masuala ≥80 kwa kawaida ni sahihi
 - **Rudia miongozo**: Sasisha CLAUDE.md kulingana na mifumo
 - **Kagua kiotomatiki**: Weka kama sehemu ya mtiririko wa kazi wa PR
 - **Amini uchujaji**: Kizingiti huzuia kelele

## Usanidi

### Kurekebisha kizingiti cha kujiamini

Kizingiti cha chaguo-msingi ni 80. Ili kurekebisha, badilisha faili ya amri kwenye 'commands/code-review.md':
'''markdown
Chuja masuala yoyote yenye alama chini ya 80.
'''

Badilisha '80' kwa kizingiti chako unachopendelea (0-100).

### Kubinafsisha lengo la ukaguzi

Hariri 'commands/code-review.md' ili kuongeza au kurekebisha kazi za wakala:
 - Ongeza mawakala wanaozingatia usalama
 - Ongeza mawakala wa uchambuzi wa utendaji
 - Ongeza mawakala wa ukaguzi wa ufikiaji
 - Ongeza ukaguzi wa ubora wa nyaraka

## Maelezo ya Kiufundi

### Usanifu wa wakala
 - **Mawakala 2x wa utiifu wa CLAUDE.md**: Ukombozi kwa ukaguzi wa miongozo
 - **Kigunduzi 1x cha hitilafu**: Kimezingatia hitilafu dhahiri katika mabadiliko pekee
 - **Mchambuzi 1x wa historia**: Muktadha kutoka git blame na historia
 - **Nx waweka alama za kujiamini**: Mmoja kwa kila suala kwa alama huru

### Mfumo wa kuweka alama
 - Kila suala huwekwa alama kwa uhuru 0-100
 - Kuweka alama huzingatia nguvu ya ushahidi na uthibitishaji
 - Kizingiti (chaguo-msingi 80) huchuja masuala yenye kujiamini kidogo
 - Kwa masuala ya CLAUDE.md: huthibitisha mwongozo unataja wazi

### Ujumuishaji wa GitHub
Hutumia 'gh' CLI kwa:
 - Kuangalia maelezo ya PR na diffs
 - Kuchukua data ya hazina
 - Kusoma git blame na historia
 - Kuchapisha maoni ya ukaguzi

## Mwandishi

Boris Cherny (boris @anthropic.com)

## Toleo

1.0.0
