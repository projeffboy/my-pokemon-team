import sys, html
OUT=sys.argv[1]
INK="#222"; MUTED="#666"; LINE="#999"; FILL="#f3f3f3"; NEW="#1565c0"; NEWFILL="#e3f0fc"; OK="#2e7d32"; BAD="#c62828"; WARN="#b26a00"
class Svg:
    def __init__(s,w,h,title):
        s.w,s.h=w,h; s.o=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="Helvetica, Arial, sans-serif" role="img" aria-label="{html.escape(title)}">',
          f'<title>{html.escape(title)}</title>', f'<rect width="{w}" height="{h}" fill="#fff"/>']
    def rect(s,x,y,w,h,fill="#fff",stroke=LINE,r=4,dash=None,sw=1.5):
        d=f' stroke-dasharray="{dash}"' if dash else ''
        s.o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')
    def text(s,x,y,t,size=14,fill=INK,weight="normal",anchor="start",style=""):
        st=f' font-style="{style}"' if style else ''
        s.o.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" text-anchor="{anchor}"{st}>{html.escape(t)}</text>')
    def lines(s,x,y,ts,size=13,fill=INK,lh=18,**k):
        for i,t in enumerate(ts): s.text(x,y+i*lh,t,size,fill,**k)
    def line(s,x1,y1,x2,y2,stroke=LINE,sw=1.5,dash=None):
        d=f' stroke-dasharray="{dash}"' if dash else ''
        s.o.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{d}/>')
    def circle(s,x,y,r,fill="#fff",stroke=LINE,sw=1.5):
        s.o.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
    def button(s,x,y,w,label,h=30,primary=False,new=False):
        s.rect(x,y,w,h,fill=(INK if primary else "#fff"),stroke=(NEW if new else INK),r=4,dash=("5 3" if new else None))
        s.text(x+w/2,y+h/2+5,label,13,("#fff" if primary else INK),"bold","middle")
    def field(s,x,y,w,label,value,new=False,h=44):
        s.rect(x,y,w,h,fill=(NEWFILL if new else "#fff"),stroke=(NEW if new else LINE),dash=("5 3" if new else None))
        s.text(x+10,y+16,label,11,(NEW if new else MUTED))
        s.text(x+10,y+35,value,14)
        s.text(x+w-18,y+30,"▾",12,MUTED)
    def check(s,x,y,label,state):  # state: ok / no / ask
        col={"ok":OK,"no":MUTED,"ask":NEW}[state]; sym={"ok":"✓","no":"✕","ask":"?"}[state]
        s.circle(x+9,y-5,9,fill=("#fff" if state!="ok" else OK),stroke=col)
        s.text(x+9,y,sym,12,("#fff" if state=="ok" else col),"bold","middle")
        s.text(x+26,y,label,14)
    def callout(s,n,x,y):
        s.circle(x,y,12,fill=NEW,stroke=NEW); s.text(x,y+5,str(n),13,"#fff","bold","middle")
    def note(s,n,x,y,ts,w=None):
        s.callout(n,x,y); s.lines(x+20,y+5,ts,13)
    def card(s,x,y,w,h,title=None):
        s.rect(x,y,w,h,fill=FILL,stroke=LINE,r=6)
        if title: s.text(x+w/2,y+26,title,16,INK,"bold","middle")
    def save(s,name):
        s.o.append('</svg>'); open(f"{OUT}/{name}",'w').write('\n'.join(s.o)+'\n')

def checklist(s,x,y,w,spin,title="Team Checklist"):
    cw=(w-20)/3
    for i,(g,items) in enumerate([("General",[("Entry Hazard","ok"),("Spinner/Defogger",spin),("Reliable Recovery","no")]),
                                   ("Defensive",[("Cleric","no"),("Status Move","ok"),("Phazer","ok")]),
                                   ("Offensive",[("Boosting Move","ok"),("Volt-turn Move","no"),("Choice Item","no")])]):
        s.text(x+30+i*cw,y,g,14,INK,"bold")
        for j,(lab,st) in enumerate(items): s.check(x+30+i*cw,y+28+j*26,lab,st)

# ---------- M1: battle format on the checklist
s=Svg(980,560,"Mock-up M1: battle format set on the Team Checklist")
s.text(20,30,"M1  Battle format on the Team Checklist (option A)",18,INK,"bold")
s.text(20,52,"Generation 4 team with a pokemon that knows Defog. Blue dashed parts are new.",13,MUTED)
for k,(x,title,sel,spin) in enumerate([(20,"Battle format not set",2,"ask"),(500,"Player picks Doubles",1,"ok")]):
    s.text(x,84,title,14,MUTED,"bold")
    s.card(x,96,460,250,"Team Checklist")
    # segmented control
    sx=x+100; s.rect(sx,136,260,30,fill=NEWFILL,stroke=NEW,dash="5 3")
    for i,l in enumerate(["Singles","Doubles","Not set"]):
        if i==sel: s.rect(sx+i*260/3+2,138,260/3-4,26,fill=NEW,stroke=NEW,r=3)
        s.text(sx+i*260/3+260/6,156,l,13,("#fff" if i==sel else INK),"bold","middle")
    checklist(s,x,200,460,spin)
    s.callout(1,sx-18,151)
    s.callout(2 if k==0 else 3,x+14,249)
s.rect(20,300,460,36,fill=NEWFILL,stroke=NEW,dash="5 3")
s.lines(32,315,["Spinner/Defogger depends on the battle format: in Generations 4 and 5,","Defog clears your own side's hazards only in doubles."],12,INK,15)
s.note(1,32,390,["Singles, Doubles, or Not set, kept with the team and in its share link","(REQ-ANLY-12, REQ-ANLY-13). Teams and links made before this are Not set (REQ-ANLY-17)."])
s.note(2,32,444,["Not set: a role whose result differs between singles and doubles shows a question","mark and says why (REQ-ANLY-16)."])
s.note(3,32,498,["Doubles: Defog counts as hazard removal in Generations 4 and 5 (REQ-ANLY-14).","From Generation 6 it counts in both formats, as today (REQ-ANLY-15)."])
s.save("m1-battle-format-on-checklist.svg")

# ---------- M2: battle format in team settings
s=Svg(980,520,"Mock-up M2: battle format in the team's settings")
s.text(20,30,"M2  Battle format in the team's settings (option B)",18,INK,"bold")
s.text(20,52,"The same setting, placed with the team's name, generation, and format.",13,MUTED)
s.rect(20,76,430,330,fill="#fff",stroke=INK,r=8)
s.text(44,110,"Team settings",18,INK,"bold")
s.field(44,128,382,"Team name","Sinnoh doubles")
s.field(44,182,382,"Generation","Gen 4  ·  Diamond Pearl Platinum / HeartGold SoulSilver")
s.field(44,236,382,"Format","Doubles OU")
s.field(44,290,382,"Battle format","Doubles",new=True)
s.button(270,352,70,"Cancel"); s.button(350,352,76,"Save",primary=True)
s.callout(1,32,312)
s.card(500,76,460,200,"Team Checklist")
s.rect(790,88,80,22,fill=NEWFILL,stroke=NEW,dash="5 3",r=11); s.text(830,104,"Doubles",12,NEW,"bold","middle")
checklist(s,500,136,460,"ok")
s.callout(2,884,99)
s.note(1,32,446,["One more field in the dialog that already holds the team's name, generation, and format."])
s.note(2,32,486,["The checklist shows which battle format it was judged under; selecting the chip opens the settings."])
s.lines(500,310,["Compared with option A:","+ keeps every team setting in one place","+ the checklist card stays as compact as it is today","−  two steps away from the checklist it affects","−  easy to miss, so more teams stay Not set"],13,INK,20)
s.save("m2-battle-format-in-team-settings.svg")

# ---------- M3: legality warnings
s=Svg(980,560,"Mock-up M3: team legality warnings")
s.text(20,30,"M3  Team legality warnings (P6)",18,INK,"bold")
s.text(20,52,"A Generation 9 team with the OU format. The rules are already computed; only the display is new.",13,MUTED)
# slot card
s.card(20,76,300,190)
s.rect(34,90,150,26,fill="#fff"); s.text(42,108,"Mewtwo",14)
s.circle(86,176,34,fill="#fff"); s.text(86,182,"sprite",11,MUTED,anchor="middle")
for i,m in enumerate(["Psystrike","Aura Sphere","Recover","Ice Beam"]): s.rect(196,90+i*30,110,26,fill="#fff"); s.text(204,108+i*30,m,13)
s.rect(34,224,150,26,fill="#fff"); s.text(42,242,"Leftovers",13)
s.rect(196,224,110,26,fill="#fff"); s.text(204,242,"Pressure",13)
s.circle(304,90,12,fill=WARN,stroke=WARN); s.text(304,95,"!",14,"#fff","bold","middle")
s.callout(1,338,90)
# problems card
s.rect(380,76,580,230,fill=NEWFILL,stroke=NEW,dash="5 3",r=6)
s.text(670,104,"Team problems (4)",16,INK,"bold","middle")
for i,m in enumerate(["Mewtwo is not allowed in OU: Over Used.","Gengar cannot have Levitate.","Garchomp has 512 EVs (at most 510).","Two pokemon hold Leftovers (Item Clause)."]):
    y=140+i*38; s.circle(404,y-5,10,fill=WARN,stroke=WARN); s.text(404,y,"!",13,"#fff","bold","middle"); s.text(426,y,m,14)
    s.line(396,y+14,944,y+14,stroke="#bcd3ea",sw=1)
s.callout(2,358,150)
s.rect(380,326,580,56,fill=NEWFILL,stroke=NEW,dash="5 3",r=6)
s.circle(404,354,10,fill=OK,stroke=OK); s.text(404,359,"✓",12,"#fff","bold","middle"); s.text(426,359,"No problems found for Gen 9, OU: Over Used.",14)
s.callout(3,358,354)
s.note(1,32,420,["A marker on each slot that a problem concerns. Selecting it shows that pokemon's problems."])
s.note(2,32,456,["Each rule the team breaks, naming the pokemon, in the site's language (REQ-ANLY-18).","Rules checked: format, ability, required item, repeated move, training limits, nickname,","level, tera type, species clause, item clause (REQ-ANLY-19)."])
s.note(3,32,524,["A team that breaks no rule says so, so that silence is never read as \"not checked\"."])
s.save("m3-legality-warnings.svg")

# ---------- M4: dropped entries notice
s=Svg(980,500,"Mock-up M4: notice of entries dropped from a link")
s.text(20,30,"M4  Notice of entries dropped from a link or a saved team (P7)",18,INK,"bold")
s.text(20,52,"Shown when a share link or saved team names something the team's game no longer has.",13,MUTED)
s.rect(20,76,940,150,fill=FILL,stroke=LINE,r=6)
s.text(40,104,"(the team, opened from the link, with the entries below left out)",13,MUTED,style="italic")
for i in range(6): s.rect(40+i*152,120,140,90,fill="#fff"); s.text(110+i*152,170,f"Pokemon {i+1}",12,MUTED,anchor="middle")
s.rect(170,250,640,124,fill=NEWFILL,stroke=NEW,dash="5 3",r=6)
s.circle(196,280,11,fill=WARN,stroke=WARN); s.text(196,285,"!",14,"#fff","bold","middle")
s.text(218,285,"2 entries from this link are not in Generations 6–9 and were left out:",14,INK,"bold")
s.text(218,310,"Pokemon 3's move ‹move name›   ·   Pokemon 5's item ‹item name›",14)
s.button(628,330,80,"Details",new=True); s.button(718,330,76,"Dismiss",new=True)
s.callout(1,158,262); s.callout(2,606,345)
s.note(1,32,414,["Names each pokemon, move, item, and ability that was left out, and the slot it was in (REQ-INFO-8).","Today these are dropped without a word."])
s.note(2,32,464,["Details shows the link's original text, so the Player can copy what was lost."])
s.save("m4-dropped-entries-notice.svg")

# ---------- M5: version transfer
s=Svg(980,520,"Mock-up M5: taking the current team to the other site version")
s.text(20,30,"M5  Taking the current team to the other site version (P2)",18,INK,"bold")
s.text(20,52,"The confirmation shown before leaving for the old website: today, and as planned.",13,MUTED)
for x,title,body,btn,new in [(20,"Today",["Your current team won’t transfer to the old","website. Teams already saved here will remain","on this version."],"Go to old website",False),
                             (500,"Planned",["Your current team will open on the old website.","Teams saved here will remain on this version."],"Go with my team",True)]:
    s.text(x,84,title,14,MUTED,"bold")
    s.rect(x,96,460,250,fill="#fff",stroke=INK,r=8)
    s.text(x+24,132,"Switch to the old website?",18,INK,"bold")
    s.lines(x+24,164,body,14,INK,20)
    if new:
        s.rect(x+24,222,412,60,fill=NEWFILL,stroke=NEW,dash="5 3")
        s.circle(x+44,252,10,fill=WARN,stroke=WARN); s.text(x+44,257,"!",13,"#fff","bold","middle")
        s.lines(x+64,246,["The old website has Generations 6–9 only.","2 of your pokemon will not carry over."],13,INK,18)
    s.button(x+200,298,70,"Cancel"); s.button(x+280,298,156,btn,primary=not new,new=new)
s.callout(1,488,196); s.callout(2,488,252); s.callout(3,952,313)
s.note(1,32,390,["The current team goes with the Player to the old website (REQ-SITE-3). The way back carries nothing."])
s.note(2,32,426,["What will not carry over is said before leaving. The old website covers Generations 6–9, so a team","from another generation cannot arrive whole (REQ-SITE-5, proposed by the analyst)."])
s.note(3,32,482,["Saved teams stay where they were made. Bringing them across (REQ-SITE-4) was rejected in the interview."])
s.save("m5-version-transfer.svg")
