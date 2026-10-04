/* FINUITY Learn
   Micro-lessons, a before/after literacy quiz, and money tips that use the person's own numbers.
   General financial education only. It never tells anyone what to do with their specific money. */
(function(){
'use strict';
var W=window;
function S(){try{return state}catch(e){return{}}}
function LS(){var s=S();if(!s.learn||typeof s.learn!=='object')s.learn={};var l=s.learn;if(!l.done)l.done={};return l}
function persist(){try{save()}catch(e){}}
function $(id){return document.getElementById(id)}
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){try{return fmt(n)}catch(e){return '₱'+Math.round(n).toLocaleString()}}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}

var POST_UNLOCK=4;   // lessons to finish before the Progress Quiz opens
var TOPICS={budgeting:'Budgeting',saving:'Saving',tracking:'Tracking',spending:'Smart spending',debt:'Debt & credit',safety:'Scams & safety',investing:'Investing'};

/* ───────── lessons ─────────
   In every question the FIRST option is the correct one; options are shuffled when shown. */
var LESSONS=[
{id:'budgeting',e:'📊',title:'Budgeting 101',min:2,intro:'A plan for your money, before it disappears.',
 cards:[
  {h:'A budget is a plan, not a punishment',p:'A budget just tells your money where to go before you spend it. It is not about cutting everything. It is about choosing what matters to you.'},
  {h:'Try 50/30/20',p:'A popular starting point: about 50% of your money for needs, 30% for wants and 20% for savings or paying debt.',ex:'Allowance of ₱5,000 → ₱2,500 needs, ₱1,500 wants, ₱1,000 savings. Your split can be different. It is only a start.'},
  {h:'Needs vs wants',p:'Needs keep life running: food, fare to school, bills, load for class. Wants are nice to have: milk tea runs, new skins, extra shoes.',ex:'Some things are both. A phone for school is a need. The newest model is a want.'},
  {h:'Make it realistic',p:'A budget that is too tight gets dropped in two weeks. Look at what you actually spent last month, set limits you can really follow, and adjust once a month.'}],
 check:[
  {q:'Using 50/30/20 on ₱10,000 a month, how much goes to savings?',o:['₱2,000','₱1,000','₱3,000','₱5,000'],e:'20% of ₱10,000 is ₱2,000.'},
  {q:'Which is most likely a want?',o:['A third pair of limited-edition sneakers','Fare to school','Groceries for the week','Materials for a school project'],e:'Wants are nice to have. Fare, food and school materials are needs.'},
  {q:'Your budget keeps failing within two weeks. Best first fix?',o:['Check what you really spend and set limits you can follow','Make the limits even smaller','Stop budgeting','Ignore overspending'],e:'Realistic limits based on real spending are the ones people stick to.'}],
 tryIt:{label:'Set your monthly budget',page:'goals'}},

{id:'saving',e:'🐷',title:'Save First, Spend Next',min:2,intro:'Build the habit that protects you from surprises.',
 cards:[
  {h:'Pay yourself first',p:'Move your savings the moment money arrives, before you spend. Saving "whatever is left" usually means saving nothing.'},
  {h:'The emergency fund',p:'Money for surprises: a broken phone, a medical bill, a lost allowance. A common target is 3 to 6 months of essential expenses.',ex:'Starting small is fine. First target ₱1,000, then one month of needs, then build up.'},
  {h:'Give your goal a number',p:'"Save for a laptop" is a wish. A plan has an amount and a date.',ex:'₱30,000 by June means about ₱2,500 a month for 12 months.'},
  {h:'Let interest work for you',p:'Money in a savings account can earn interest, and over time interest earns interest too. Starting early, even small, gives your money more time to grow.'}],
 check:[
  {q:'You get ₱4,000 and want to save ₱400. What is the best habit?',o:['Move ₱400 to savings right away','Save what is left on the last day','Spend first, then see','Wait until you feel rich'],e:'Setting savings aside first makes it automatic.'},
  {q:'Which savings goal is easiest to follow?',o:['₱12,000 for a phone by December (₱2,000 a month)','Save more','Try to save someday','Spend less'],e:'A clear amount and deadline turns a wish into a plan.'},
  {q:'Why start saving early, even small amounts?',o:['More time for interest to build on itself','Small amounts do not matter','Banks require it','So you can spend more now'],e:'Time is the biggest ingredient in growth.'}],
 tryIt:{label:'Create a savings goal',page:'goals'}},

{id:'tracking',e:'🔍',title:'Where Did It Go?',min:2,intro:'See your money clearly, and the rest gets easier.',
 cards:[
  {h:'Small things add up',p:'A ₱60 milk tea, ₱20 load and ₱30 snack every day feels like nothing. It is ₱110 a day.',ex:'₱110 × 30 days = ₱3,300 a month.'},
  {h:'Log it when it happens',p:'By tonight you will have forgotten half of your purchases. Add each expense right after you pay. It takes ten seconds.'},
  {h:'Review by category',p:'Once a month, look at where most of your money went. One category usually surprises you, and that is the easiest place to adjust.'},
  {h:'Know your net worth',p:'Net worth is what you own minus what you owe. One number tells you little. Watching it move over months tells you a lot.'}],
 check:[
  {q:'₱50 a day on small treats is about how much in 30 days?',o:['₱1,500','₱500','₱150','₱15,000'],e:'₱50 × 30 = ₱1,500.'},
  {q:'When is the best time to log an expense?',o:['Right after you spend','At the end of the month','Only when it is big','Never, you will remember'],e:'Fresh entries are accurate and take seconds.'},
  {q:'You own ₱8,000 (cash and savings) and owe ₱3,000. Your net worth is…',o:['₱5,000','₱11,000','₱3,000','₱8,000'],e:'Net worth = what you own − what you owe = ₱5,000.'}],
 tryIt:{label:'Log an expense',page:'expenses'}},

{id:'spending',e:'🛍️',title:'Smart Spending',min:2,intro:'Enjoy your money without regret.',
 cards:[
  {h:'The 24-hour rule',p:'For anything you did not plan to buy, wait a day. Many wants fade by tomorrow, and the ones that stay are easier to justify.'},
  {h:'A sale is not savings',p:'A 50% discount on something you did not plan to buy is still money spent. A discount only saves you money on things you already needed.'},
  {h:'Pay later is still pay',p:'Installments and pay-later options make things feel cheaper because the cost is spread out. Each payment is a real bill. Add it to your budget the day you sign up, and check for fees.'},
  {h:'Compare before you pay',p:'Check prices in two places and watch the small fees: transfer fees, delivery fees, cash-in fees. They quietly add up.'}],
 check:[
  {q:'A flash sale on shoes you did not plan to buy. Best move?',o:['Use the 24-hour rule','Buy now before it ends','Buy two','Borrow to buy them'],e:'Waiting removes the pressure of the countdown.'},
  {q:'A 50% discount actually saves you money when…',o:['It is on something you already planned and needed','You were not planning to buy it','It is limited stock','Your friends bought it'],e:'A discount only helps if you would have bought it anyway.'},
  {q:'Pay-later installments should be treated as…',o:['Real bills to include in your budget','Free money','Optional','Someone else’s problem'],e:'They are debt that you will have to pay.'}],
 tryIt:{label:'Review your spending',page:'expenses'}},

{id:'debt',e:'💳',title:'Debt & Credit, Explained',min:3,intro:'Borrow smart, and know what it costs.',
 cards:[
  {h:'Interest is the price of borrowing',p:'When you borrow, you usually pay back more than you took. Rates quoted per month add up fast.',ex:'₱10,000 at 3% per month = ₱300 interest every month.'},
  {h:'Minimum payments are a trap',p:'Paying only the minimum keeps the balance alive longer and costs far more in interest. When you can, pay more than the minimum.'},
  {h:'Credit cards: stay light',p:'A common guideline is to use less than about 30% of your limit, and to pay the full statement on time.',ex:'On a ₱20,000 limit, 30% is ₱6,000.'},
  {h:'Utang to friends and apps',p:'Write down every utang with the date and amount, even with friends. For lending apps, check that the lender is registered with the SEC, read the total cost, and be wary of any app that asks for your contacts or uses pressure.'}],
 check:[
  {q:'You borrow ₱10,000 at 3% interest per month. About how much interest after one month?',o:['₱300','₱30','₱3,000','₱30,000'],e:'3% of ₱10,000 is ₱300.'},
  {q:'Paying only the minimum on a credit card usually…',o:['Keeps you in debt longer and costs more','Clears the debt fastest','Removes the interest','Raises your limit'],e:'Interest keeps building on the unpaid balance.'},
  {q:'A card has a ₱20,000 limit. Which balance is closest to the common 30% guideline?',o:['₱6,000','₱18,000','₱20,000','₱12,000'],e:'30% of ₱20,000 is ₱6,000.'}],
 tryIt:{label:'Track a loan',page:'loans'}},

{id:'safety',e:'🛡️',title:'Scams & Money Safety',min:2,intro:'Keep what you worked for.',
 cards:[
  {h:'Your OTP and PIN are yours alone',p:'Banks and e-wallets do not need your OTP or PIN, ever. If someone asks, it is a scammer, even if they sound official and know your name.'},
  {h:'Too good to be true',p:'"Double your money in a week", "guaranteed returns" and pressure to invite friends are classic red flags for pyramid and Ponzi schemes. Real investments can lose value.'},
  {h:'Check the link',p:'Fake texts and pages copy real ones. Do not tap links in surprise messages. Open the official app or type the website yourself.'},
  {h:'Lock things down',p:'Use a different strong password for each money app, lock your phone, and turn on app lock or fingerprint. If a phone or SIM is lost, tell your bank or wallet right away.'}],
 check:[
  {q:'A caller from "e-wallet support" asks for your OTP. You should…',o:['Hang up and contact official support yourself','Give it, they sound legit','Send it by text instead','Ask them to call back later'],e:'Real support never needs your OTP.'},
  {q:'"Invest ₱5,000, get ₱10,000 in one week, guaranteed!" is most likely…',o:['A scam','A great deal','A bank promo','Government-backed'],e:'Guaranteed fast doubling is a major red flag.'},
  {q:'Which is a strong way to protect your accounts?',o:['A different password for each app plus a phone lock','One easy password everywhere','Sharing your PIN with a friend','Writing your PIN on your phone case'],e:'Unique passwords and a lock limit the damage of any single leak.'}],
 tryIt:{label:'Check your PIN & security',page:'settings'}},

{id:'investing',e:'📈',title:'Investing for Beginners',min:3,intro:'The basics before you ever put in a peso.',
 cards:[
  {h:'First things first',p:'Build an emergency fund and clear high-interest debt before investing. Only invest money you will not need soon.'},
  {h:'Risk and return travel together',p:'Higher possible returns usually come with a higher chance of losing money. Savings accounts are lower risk and lower return. Stocks are higher risk with higher possible return.'},
  {h:'Do not put all your eggs in one basket',p:'Diversification means spreading money across different things, so one bad result does not sink everything. Funds hold many investments in one.'},
  {h:'Time beats timing',p:'Investing small amounts regularly over many years usually matters more than trying to find the perfect moment. Learn from official sources, and be careful with "hot tips" on social media. This is education, not advice.'}],
 check:[
  {q:'Before investing, it is wise to first…',o:['Build an emergency fund and clear costly debt','Borrow money to invest','Put everything in one stock','Wait for a hot tip'],e:'A safety net lets you ride out rough patches.'},
  {q:'Higher possible returns usually come with…',o:['Higher risk of loss','No risk','Guaranteed profit','Lower fees'],e:'Risk and potential return rise together.'},
  {q:'Why do people spread money across several investments?',o:['To limit the damage if one does badly','To pay more fees','To avoid ever earning','Because it is required'],e:'That is diversification.'}],
 tryIt:{label:'Check your goals',page:'goals'}}
];
var LMAP={};LESSONS.forEach(function(l){LMAP[l.id]=l});

/* ───────── before / after quiz (two matched forms, 10 questions each) ───────── */
var FORM_A=[
 {id:'a1',t:'budgeting',q:'Which best describes a budget?',o:['A plan for where your money will go','A list of things you cannot buy','Only a record of past spending','A type of savings account'],e:'A budget is a plan made before you spend.'},
 {id:'a2',t:'budgeting',q:'In the 50/30/20 rule, the "30" usually stands for…',o:['Wants','Needs','Savings','Debt'],e:'50% needs, 30% wants, 20% savings or debt.'},
 {id:'a3',t:'saving',q:'What is an emergency fund for?',o:['Unexpected costs like a medical bill or a broken phone','Shopping sales','Paying for vacations','Lending to friends'],e:'It is a cushion for surprises.'},
 {id:'a4',t:'saving',q:'You get ₱3,000 allowance and want to save ₱300. Which habit works best?',o:['Move ₱300 to savings as soon as you get it','Save whatever is left at month end','Spend first, then decide','Save only if you feel like it'],e:'Paying yourself first makes saving automatic.'},
 {id:'a5',t:'tracking',q:'Why is it useful to track small expenses?',o:['They add up and show where your money really goes','They do not matter','Only large purchases count','It is only for accountants'],e:'Small daily spending can add up to thousands each month.'},
 {id:'a6',t:'spending',q:'You see a sale on something you had not planned to buy. A good first step is to…',o:['Wait 24 hours before deciding','Buy it before the sale ends','Buy two to save more','Borrow so you do not miss out'],e:'The 24-hour rule beats sale pressure.'},
 {id:'a7',t:'debt',q:'Interest on a loan is…',o:['The cost of borrowing money','A free bonus','A government tax','Money the lender gives you'],e:'Interest is what you pay for using someone else’s money.'},
 {id:'a8',t:'debt',q:'Paying only the minimum on a credit card balance usually…',o:['Costs more in interest over time','Clears the debt fastest','Cancels the interest','Increases your savings'],e:'The unpaid balance keeps collecting interest.'},
 {id:'a9',t:'safety',q:'Someone claiming to be from your bank asks for the OTP sent to your phone. You…',o:['Refuse and contact the bank yourself','Share it to verify your account','Send it by chat','Share only the first 3 digits'],e:'Banks never need your OTP.'},
 {id:'a10',t:'investing',q:'Which statement about investing is most accurate?',o:['Higher possible returns usually come with higher risk','Returns are always guaranteed','There is no risk if many people invest','Only rich people can invest'],e:'Risk and return rise together.'}
];
var FORM_B=[
 {id:'b1',t:'budgeting',q:'The main purpose of a budget is to…',o:['Decide ahead of time how your money will be used','Stop you from ever having fun','Track only your debts','Impress your friends'],e:'A budget gives your money a job before you spend it.'},
 {id:'b2',t:'budgeting',q:'Which is a "need" for most students?',o:['Fare to get to school','A concert ticket','A new game skin','Branded accessories'],e:'Needs are the basics that keep daily life going.'},
 {id:'b3',t:'saving',q:'A commonly suggested full emergency fund is about…',o:['3 to 6 months of essential expenses','One day of expenses','₱100','Whatever is in your pocket'],e:'Three to six months of essentials is the usual guide.'},
 {id:'b4',t:'saving',q:'Which savings goal is the best?',o:['₱6,000 for a bike by March (₱1,000 a month)','Save more money','Try saving someday','Save if possible'],e:'A clear amount and date make a goal trackable.'},
 {id:'b5',t:'tracking',q:'Net worth is…',o:['What you own minus what you owe','Your monthly income','Your total debt','Your savings goal'],e:'Assets minus liabilities.'},
 {id:'b6',t:'spending',q:'"Buy now, pay later" installments should be…',o:['Counted as real bills in your budget','Ignored until due','Treated as free','Skipped when you are busy'],e:'Each installment is a payment you owe.'},
 {id:'b7',t:'debt',q:'You borrow ₱5,000 at 2% interest per month. About how much interest after one month?',o:['₱100','₱10','₱1,000','₱10,000'],e:'2% of ₱5,000 is ₱100.'},
 {id:'b8',t:'debt',q:'A common guideline is to keep credit card use below about…',o:['30% of your limit','90% of your limit','100% of your limit','Any amount is fine'],e:'Lower use is easier to pay off and is seen as healthier.'},
 {id:'b9',t:'safety',q:'A text says "Your account is locked! Tap this link to fix it." Best response?',o:['Do not tap. Open the official app or website yourself','Tap and enter your details','Forward it to friends','Reply with your PIN'],e:'Fake links are a common phishing trick.'},
 {id:'b10',t:'investing',q:'Diversification means…',o:['Spreading your money across different investments','Putting everything in one stock','Keeping all money as cash at home','Borrowing to invest'],e:'Spreading money limits the damage when one thing does badly.'}
];
var QUIZ_MIN={pre:'3 min',post:'3 min'};

/* ───────── short general tips (splash, Fin, dashboard) ───────── */
var TIPS=[
 {t:'Milk tea three times a week at ₱120 each is about ₱1,440 a month. Not wrong, just good to know.',l:'tracking'},
 {t:'Move your savings the same day money arrives. What is left at month end is often zero.',l:'saving'},
 {t:'Before buying something you did not plan for, wait 24 hours. Many wants fade by tomorrow.',l:'spending'},
 {t:'Write down every utang, even small ones, with the date. Clear numbers keep friendships easy.',l:'debt'},
 {t:'Your OTP is yours alone. No bank, e-wallet or "support agent" will ever need it.',l:'safety'},
 {t:'Got a 13th month pay or a bonus? Decide your savings share before it arrives.',l:'saving'},
 {t:'Start an emergency fund small: ₱1,000 first, then one month of needs.',l:'saving'},
 {t:'50/30/20 is a starting point, not a rule. Adjust it until it fits your life.',l:'budgeting'},
 {t:'A 50% discount on something you did not need still costs you 50% of its price.',l:'spending'},
 {t:'Installments are real bills. Add each payment to your budget the day you sign up.',l:'spending'},
 {t:'Paying even a little more than the minimum cuts the total interest you pay.',l:'debt'},
 {t:'"Guaranteed fast money" is almost always a scam. Real investments can lose value.',l:'safety'},
 {t:'Check your biggest spending category once a month. It often hides one easy fix.',l:'tracking'},
 {t:'Give each goal a number and a date. "Save more" is a wish. "₱3,000 by March" is a plan.',l:'saving'},
 {t:'Invest only after you have an emergency fund and no high-interest debt.',l:'investing'},
 {t:'Small amounts invested regularly for years usually beat trying to time the market.',l:'investing'},
 {t:'Interest earns interest. The earlier you start saving, even a little, the more it can grow.',l:'saving'},
 {t:'Keep credit card use under about 30% of the limit and pay the full statement on time.',l:'debt'},
 {t:'Use a different password for every money app, and turn on app lock.',l:'safety'},
 {t:'Log an expense right when you spend. By tonight you will have forgotten half of them.',l:'tracking'}
];

/* ───────── insights from the person's own numbers ───────── */
function td(){try{return today()}catch(e){return new Date().toISOString().slice(0,10)}}
function monthSum(arr,mk){return arr.filter(function(e){return String(e.date||'').slice(0,7)===mk}).reduce(function(a,b){return a+(+b.amount||0)},0)}
function insights(){
  var s=S(),out=[],ex=s.expenses||[],inc=s.income||[],ws=s.wallets||[],loans=s.loans||[],goals=s.goals||[];
  var mk=td().slice(0,7),now=new Date(),yr=now.getFullYear(),mi=now.getMonth(),MO=[];
  try{MO=MONTH_ORDER}catch(e){}
  var exM=ex.filter(function(e){return String(e.date||'').slice(0,7)===mk}),spent=exM.reduce(function(a,b){return a+(+b.amount||0)},0);
  var earned=inc.filter(function(i){return i.month===MO[mi]&&(i.year||yr)===yr}).reduce(function(a,b){return a+(+b.amount||0)},0);
  if(!ex.length)out.push({id:'first',icon:'📝',title:'Log your first expense',text:'Tracking is the first money habit. Even one entry a day shows you where your money goes.',lesson:'tracking',cta:{label:'Log an expense',page:'expenses'}});
  else{
    var last=ex.map(function(e){return String(e.date||'')}).sort().pop(),days=Math.floor((new Date(td())-new Date(last))/864e5);
    if(days>=3)out.push({id:'stale',icon:'⏰',title:'It has been '+days+' days since your last expense',text:'Logging right when you spend keeps your numbers honest. Anything to catch up on?',lesson:'tracking',cta:{label:'Log an expense',page:'expenses'}});
  }
  if(earned>0&&exM.length){
    var rate=Math.round((earned-spent)/earned*100);
    if(spent>earned)out.push({id:'over',icon:'⚠️',title:'You have spent '+money(spent-earned)+' more than you earned this month',text:'It happens. Look at your biggest category and see what can wait. A simple budget helps.',lesson:'budgeting',cta:{label:'Set a budget',page:'goals'}});
    else if(rate>=20)out.push({id:'rate',icon:'🎉',title:'You are saving about '+rate+'% this month',text:'That meets the 20% savings share in the 50/30/20 rule. Nice. Keep it going.',lesson:'saving'});
    else out.push({id:'rate',icon:'📊',title:'You are saving about '+rate+'% this month',text:'A common target is around 20%. Even a small bump adds up over a year.',lesson:'saving'});
  }
  if(exM.length>=3){
    var by={};exM.forEach(function(e){by[e.cat||'other']=(by[e.cat||'other']||0)+(+e.amount||0)});
    var k=Object.keys(by).sort(function(a,b){return by[b]-by[a]})[0],pct=Math.round(by[k]/spent*100),lab=k;
    try{lab=(CAT_LABELS[k]||k)}catch(e){}
    if(pct>=40)out.push({id:'cat',icon:'🔎',title:String(lab).replace(/^[^\p{L}\p{N}]+/u,'')+' is '+pct+'% of your spending this month',text:'One category taking this much is worth a look. Is it a need, a want, or a habit?',lesson:'spending'});
  }
  var lim=+s.budgetLimit||0;
  if(!lim)out.push({id:'nobud',icon:'🎯',title:'No monthly budget yet',text:'A budget gives your money a job before you spend it. Start with a number you can really follow.',lesson:'budgeting',cta:{label:'Set a budget',page:'goals'}});
  else if(spent>=lim*.8)out.push({id:'bud',icon:'🚦',title:'You have used '+Math.round(spent/lim*100)+'% of this month’s budget',text:'Time to slow down on wants for the rest of the month.',lesson:'budgeting'});
  var cash=ws.filter(function(w){return(w.type!=='credit')&&(+w.balance>0)}).reduce(function(a,b){return a+(+b.balance)},0);
  var months={};ex.forEach(function(e){var m=String(e.date||'').slice(0,7);if(m)months[m]=(months[m]||0)+(+e.amount||0)});
  var mkeys=Object.keys(months).sort().slice(-3);
  if(mkeys.length){
    var avg=mkeys.reduce(function(a,m){return a+months[m]},0)/mkeys.length;
    if(avg>0){var cover=cash/avg;
      out.push({id:'fund',icon:'🛟',title:'Your cash covers about '+(cover<1?Math.max(1,Math.round(cover*4))+' week'+(Math.round(cover*4)===1?'':'s'):cover.toFixed(1)+' months')+' of spending',text:'A common emergency fund target is 3 to 6 months. Build it a little at a time.',lesson:'saving',cta:{label:'Make a goal',page:'goals'}});}
  }
  if(!goals.length)out.push({id:'nogoal',icon:'🏁',title:'No savings goal yet',text:'Goals with an amount and a date are far easier to reach than "save more".',lesson:'saving',cta:{label:'Create a goal',page:'goals'}});
  var owe=loans.filter(function(l){return l.type==='payable'&&!l.settled}).reduce(function(a,b){return a+(+b.amount||0)},0);
  if(owe>0)out.push({id:'owe',icon:'🤝',title:'You owe '+money(owe)+' in total',text:'Write down what is due and when. Paying a bit more than the minimum saves interest.',lesson:'debt',cta:{label:'See loans',page:'loans'}});
  ws.forEach(function(w){
    var l=+w.limit||0,used=Math.max(0,-(+w.balance||0));
    if(w.type==='credit'&&l>0&&used/l>.3)out.push({id:'util-'+w.id,icon:'💳',title:w.label+' is at '+Math.round(used/l*100)+'% of its limit',text:'Many people aim to stay under about 30% and pay the full statement on time.',lesson:'debt'});
  });
  return out;
}
function insightOfDay(){var a=insights();return a.length?pick(a.slice(0,5)):null}
function tipOfDay(){
  var ins=Math.random()<.6?insightOfDay():null;
  if(ins)return{text:ins.title+'. '+ins.text,ref:'From your numbers · '+LMAP[ins.lesson].title,lesson:ins.lesson};
  var t=pick(TIPS);return{text:t.t,ref:LMAP[t.l].title+' · '+LMAP[t.l].min+' min lesson',lesson:t.l};
}
function insightMessage(){
  var i=insightOfDay();if(!i)return null;
  return{text:i.title+'. '+i.text,mood:'idle',actions:[{label:'📚 '+LMAP[i.lesson].title,kind:'learn',id:i.lesson},{label:'Another tip',kind:'tip'},{label:'Menu',kind:'menu'}]};
}

/* ───────── levels ───────── */
function doneCount(){return Object.keys(LS().done).filter(function(k){return LMAP[k]}).length}
function level(n){return n>=7?{e:'🏆',n:'Money Pro'}:n>=5?{e:'📊',n:'Budgeter'}:n>=3?{e:'🐷',n:'Saver'}:n>=1?{e:'🐣',n:'Getting started'}:{e:'🌱',n:'Money newbie'}}

/* ───────── view state ───────── */
var V={t:'home'};
function active(){var el=$('learn');return !!(el&&el.classList.contains('active'))}
function go(v){V=v;render();try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){}}
function home(){go({t:'home'})}

function render(){
  if(!active())return;
  var root=$('learn-root');if(!root)return;
  var h='';
  if(V.t==='lesson')h=viewLesson();
  else if(V.t==='check')h=viewCheck();
  else if(V.t==='done')h=viewDone();
  else if(V.t==='quiz')h=viewQuiz();
  else if(V.t==='result')h=viewResult();
  else h=viewHome();
  var out='<div class="lrn-view">'+h+'</div>';
  if(root._h===out&&root.childNodes.length)return;
  root._h=out;root.innerHTML=out;
}

/* home */
function viewHome(){
  var L=LS(),n=doneCount(),lv=level(n),pre=L.pre,post=L.post,h='';
  h+='<div class="lrn-hero"><div class="lrn-lv"><span class="lrn-lv-e">'+lv.e+'</span><div><div class="lrn-lv-n">'+lv.n+'</div><div class="lrn-lv-s">'+n+' of '+LESSONS.length+' lessons done</div></div></div>'
    +'<div class="lrn-bar"><i style="width:'+Math.round(n/LESSONS.length*100)+'%"></i></div></div>';
  // quiz banner
  if(!pre){
    h+='<div class="lrn-ban"><div class="lrn-ban-t"><b>Take the Starter Quiz first</b><span>10 questions, about '+QUIZ_MIN.pre+'. No pressure. It shows where you are starting, so we can see how much you grow.</span></div><button class="lrn-btn" onclick="FinLearn.startQuiz(\'pre\')">Start quiz</button></div>';
  }else if(!post){
    var ready=n>=POST_UNLOCK;
    h+='<div class="lrn-ban'+(ready?'':' off')+'"><div class="lrn-ban-t"><b>Progress Quiz</b><span>'+(ready?'You are ready. Same topics, new questions. See how far you have come.':'Finish '+(POST_UNLOCK-n)+' more lesson'+(POST_UNLOCK-n===1?'':'s')+' to unlock. Starter score: '+pre.pct+'%.')+'</span></div>'+(ready?'<button class="lrn-btn" onclick="FinLearn.startQuiz(\'post\')">Take it</button>':'<span class="lrn-lock">🔒</span>')+'</div>';
  }else{
    var d=post.pct-pre.pct;
    h+='<div class="lrn-ban done"><div class="lrn-ban-t"><b>Starter '+pre.pct+'%  →  Progress '+post.pct+'%</b><span>'+(d>0?'You gained '+d+' points. That is real learning.':d===0?'Holding steady. Revisit a lesson to push higher.':'Down a bit. Retry a lesson and see what changed.')+'</span></div><button class="lrn-btn ghost" onclick="FinLearn.showResult(\'post\')">View</button></div>';
  }
  // insights
  var ins=insights().slice(0,3);
  if(ins.length){
    h+='<div class="lrn-sec">From your numbers</div><div class="lrn-ins">'+ins.map(function(i){
      return '<div class="lrn-in"><div class="lrn-in-i">'+i.icon+'</div><div class="lrn-in-b"><div class="lrn-in-t">'+esc(i.title)+'</div><div class="lrn-in-x">'+esc(i.text)+'</div><div class="lrn-in-a">'
        +'<button class="lrn-link" onclick="FinLearn.openLesson(\''+i.lesson+'\')">📚 '+LMAP[i.lesson].title+'</button>'
        +(i.cta?'<button class="lrn-link alt" onclick="show(\''+i.cta.page+'\')">'+i.cta.label+' →</button>':'')+'</div></div></div>';}).join('')+'</div>';
  }
  h+='<div class="lrn-sec">Lessons</div><div class="lrn-grid">'+LESSONS.map(function(l){
    var d=L.done[l.id];
    return '<button type="button" class="lrn-card'+(d?' done':'')+'" onclick="FinLearn.openLesson(\''+l.id+'\')"><span class="lrn-card-e">'+l.e+'</span><span class="lrn-card-t">'+l.title+'</span><span class="lrn-card-i">'+l.intro+'</span>'
      +'<span class="lrn-card-m">'+(d?'✓ Done · '+d.score+'/'+d.total:l.min+' min · 3 quick questions')+'</span></button>';}).join('')+'</div>';
  h+='<div class="lrn-note">General financial education, not personal advice. Quiz scores are saved to your account and may be used, without your name, in our school research.</div>';
  return h;
}

/* lesson reader */
function viewLesson(){
  var l=LMAP[V.id];if(!l)return viewHome();
  var c=l.cards[V.i],last=V.i===l.cards.length-1;
  var dots=l.cards.map(function(_,i){return '<i class="'+(i<=V.i?'on':'')+'"></i>'}).join('');
  return '<button class="lrn-back" onclick="FinLearn.home()">← All lessons</button>'
   +'<div class="lrn-rd"><div class="lrn-rd-top"><span class="lrn-rd-e">'+l.e+'</span><span class="lrn-rd-t">'+l.title+'</span></div><div class="lrn-dots">'+dots+'</div>'
   +'<div class="lrn-rd-b" key="'+V.i+'"><h2>'+c.h+'</h2><p>'+c.p+'</p>'+(c.ex?'<div class="lrn-ex"><b>Example</b>'+c.ex+'</div>':'')+'</div>'
   +'<div class="lrn-nav">'+(V.i>0?'<button class="lrn-btn ghost" onclick="FinLearn.step(-1)">← Back</button>':'<span></span>')
   +'<button class="lrn-btn" onclick="FinLearn.step(1)">'+(last?'Check yourself →':'Next →')+'</button></div></div>';
}
function step(d){
  var l=LMAP[V.id];if(!l)return;
  var i=V.i+d;
  if(i>=l.cards.length){go({t:'check',id:V.id,i:0,qs:l.check.map(prep),picked:null,score:0});return}
  if(i<0)i=0;
  go({t:'lesson',id:V.id,i:i});
}
function prep(q){return{id:q.id||'',t:q.t||'',q:q.q,e:q.e,opts:shuffle(q.o.map(function(x,i){return{t:x,ok:i===0}}))}}

/* lesson check (instant feedback) */
function viewCheck(){
  var l=LMAP[V.id],q=V.qs[V.i];if(!l||!q)return viewHome();
  var h='<button class="lrn-back" onclick="FinLearn.openLesson(\''+l.id+'\')">← Back to lesson</button><div class="lrn-rd"><div class="lrn-rd-top"><span class="lrn-rd-e">'+l.e+'</span><span class="lrn-rd-t">Check yourself · '+(V.i+1)+' of '+V.qs.length+'</span></div>'
   +'<div class="lrn-bar sm"><i style="width:'+Math.round(V.i/V.qs.length*100)+'%"></i></div><h2 class="lrn-q">'+q.q+'</h2><div class="lrn-opts">';
  q.opts.forEach(function(o,i){
    var cls='lrn-opt';
    if(V.picked!==null){if(o.ok)cls+=' ok';else if(i===V.picked)cls+=' bad';}
    h+='<button type="button" class="'+cls+'" '+(V.picked!==null?'disabled':'')+' onclick="FinLearn.answer('+i+')"><span>'+o.t+'</span></button>';
  });
  h+='</div>';
  if(V.picked!==null){
    var good=q.opts[V.picked].ok;
    h+='<div class="lrn-fb '+(good?'ok':'bad')+'"><b>'+(good?'Correct.':'Not quite.')+'</b> '+q.e+'</div><div class="lrn-nav"><span></span><button class="lrn-btn" onclick="FinLearn.next()">'+(V.i===V.qs.length-1?'Finish':'Next')+' →</button></div>';
  }
  return h+'</div>';
}
function answer(i){
  if(V.picked!==null)return;
  var q=V.qs[V.i];V.picked=i;if(q.opts[i].ok)V.score++;render();
}
function next(){
  if(V.i<V.qs.length-1){V.i++;V.picked=null;render();return}
  var L=LS(),prev=L.done[V.id],sc=V.score,tot=V.qs.length;
  L.done[V.id]={score:prev?Math.max(prev.score,sc):sc,total:tot,at:new Date().toISOString(),tries:(prev?(prev.tries||1)+1:1)};
  persist();
  try{W.dispatchEvent(new CustomEvent('fin:learn-complete',{detail:{id:V.id,score:sc,total:tot}}))}catch(e){}
  go({t:'done',id:V.id,score:sc,total:tot});
}
function viewDone(){
  var l=LMAP[V.id],idx=LESSONS.indexOf(l),nx=LESSONS[idx+1],n=doneCount();
  var msg=V.score===V.total?'Perfect. You got it.':V.score>=2?'Nice work.':'Good try. Read it once more and retry.';
  var ready=LS().pre&&!LS().post&&n>=POST_UNLOCK;
  return '<div class="lrn-rd center"><div class="lrn-big">'+l.e+'</div><h2>'+l.title+' complete</h2><div class="lrn-score">'+V.score+' / '+V.total+'</div><p>'+msg+'</p>'
   +(l.tryIt?'<div class="lrn-try"><b>Try it in FINUITY</b><button class="lrn-btn" onclick="show(\''+l.tryIt.page+'\')">'+l.tryIt.label+' →</button></div>':'')
   +(ready?'<div class="lrn-try"><b>The Progress Quiz is unlocked</b><button class="lrn-btn" onclick="FinLearn.startQuiz(\'post\')">Take it →</button></div>':'')
   +'<div class="lrn-nav stack">'+(nx?'<button class="lrn-btn ghost" onclick="FinLearn.openLesson(\''+nx.id+'\')">Next: '+nx.title+' →</button>':'')+'<button class="lrn-btn ghost" onclick="FinLearn.home()">Back to Learn</button></div></div>';
}

/* quiz (no feedback until the end, so the score is honest) */
function startQuiz(which){
  var L=LS();
  if(which==='pre'&&L.pre){showResult('pre');return}
  if(which==='post'){
    if(!L.pre){startQuiz('pre');return}
    if(L.post){showResult('post');return}
    if(doneCount()<POST_UNLOCK){home();return}
  }
  var qs=shuffle(which==='pre'?FORM_A:FORM_B).map(prep);
  show('learn');go({t:'quiz',which:which,i:0,qs:qs,picks:[],picked:null});
}
function viewQuiz(){
  var q=V.qs[V.i];if(!q)return viewHome();
  var title=V.which==='pre'?'Starter Quiz':'Progress Quiz';
  var h='<button class="lrn-back" onclick="FinLearn.quitQuiz()">← Leave quiz</button><div class="lrn-rd"><div class="lrn-rd-top"><span class="lrn-rd-e">📝</span><span class="lrn-rd-t">'+title+' · '+(V.i+1)+' of '+V.qs.length+'</span></div>'
   +'<div class="lrn-bar sm"><i style="width:'+Math.round(V.i/V.qs.length*100)+'%"></i></div><h2 class="lrn-q">'+q.q+'</h2><div class="lrn-opts">';
  q.opts.forEach(function(o,i){h+='<button type="button" class="lrn-opt'+(V.picked===i?' sel':'')+'" onclick="FinLearn.qpick('+i+')"><span>'+o.t+'</span></button>'});
  return h+'</div><div class="lrn-nav"><span></span><button class="lrn-btn" '+(V.picked===null?'disabled':'')+' onclick="FinLearn.qnext()">'+(V.i===V.qs.length-1?'Finish':'Next')+' →</button></div></div>';
}
function qpick(i){V.picked=i;render()}
function quitQuiz(){home()}
function qnext(){
  if(V.picked===null)return;
  var q=V.qs[V.i];V.picks.push({id:q.id,t:q.t,ok:!!q.opts[V.picked].ok});
  if(V.i<V.qs.length-1){V.i++;V.picked=null;render();return}
  var ok=V.picks.filter(function(p){return p.ok}).length,tot=V.picks.length,by={};
  V.picks.forEach(function(p){by[p.t]=by[p.t]||[0,0];by[p.t][1]++;if(p.ok)by[p.t][0]++});
  var rec={form:V.which==='pre'?'A':'B',score:ok,total:tot,pct:Math.round(ok/tot*100),by:by,items:V.picks.map(function(p){return[p.id,p.ok?1:0]}),at:new Date().toISOString()};
  var L=LS();
  if(V.which==='pre'){rec.lessonsBefore=doneCount();L.pre=rec}else{rec.lessonsDone=doneCount();L.post=rec}
  persist();
  try{W.dispatchEvent(new CustomEvent('fin:learn-quiz',{detail:{which:V.which,pct:rec.pct}}))}catch(e){}
  go({t:'result',which:V.which,qs:V.qs,picks:V.picks});
}
function showResult(which){
  var L=LS();if(!L[which]){home();return}
  show('learn');
  go({t:'result',which:which,qs:null,picks:null});
}
function viewResult(){
  var L=LS(),r=L[V.which],pre=L.pre,post=L.post;if(!r)return viewHome();
  var msg=r.pct>=80?'Great work.':r.pct>=50?'A solid base.':'A good place to start.';
  var h='<button class="lrn-back" onclick="FinLearn.home()">← Back to Learn</button><div class="lrn-rd center"><div class="lrn-ring" style="--p:'+r.pct+'"><b>'+r.pct+'%</b></div><h2>'+(V.which==='pre'?'Starter Quiz':'Progress Quiz')+': '+r.score+' of '+r.total+'</h2><p>'+msg+'</p>';
  if(V.which==='post'&&pre){
    var d=post.pct-pre.pct;
    h+='<div class="lrn-cmp"><div><span>Starter</span><b>'+pre.pct+'%</b></div><div class="arr">→</div><div><span>Now</span><b>'+post.pct+'%</b></div><div class="gain '+(d>0?'up':d<0?'dn':'')+'">'+(d>0?'+':'')+d+' pts</div></div>';
  }
  h+='<div class="lrn-topics">'+Object.keys(r.by||{}).map(function(k){var a=r.by[k],p=Math.round(a[0]/a[1]*100);return '<div class="lrn-tp"><span>'+(TOPICS[k]||k)+'</span><div class="lrn-bar sm"><i style="width:'+p+'%"></i></div><em>'+a[0]+'/'+a[1]+'</em></div>'}).join('')+'</div>';
  if(V.qs&&V.picks){
    h+='<details class="lrn-rev"><summary>Review answers</summary>'+V.qs.map(function(q,i){
      var good=V.picks[i].ok,right=q.opts.filter(function(o){return o.ok})[0].t;
      return '<div class="lrn-ri '+(good?'ok':'bad')+'"><b>'+(good?'✓':'✗')+' '+q.q+'</b><span>Answer: '+right+'</span><em>'+q.e+'</em></div>'}).join('')+'</details>';
  }
  if(V.which==='pre'){h+='<div class="lrn-try"><b>Now learn something</b><button class="lrn-btn" onclick="FinLearn.openLesson(\'budgeting\')">Start with Budgeting 101 →</button></div>'}
  return h+'<div class="lrn-nav stack"><button class="lrn-btn ghost" onclick="FinLearn.home()">Back to Learn</button></div></div>';
}

/* ───────── dashboard card ───────── */
function renderDash(){
  var el=$('dash-learn');if(!el)return;
  var L=LS(),h='';
  if(!L.pre){
    h='<div class="dl-card" onclick="FinLearn.startQuiz(\'pre\')"><div class="dl-e">🎓</div><div class="dl-b"><div class="dl-t">Test your money know-how</div><div class="dl-x">Take the 10-question Starter Quiz, then unlock short lessons.</div></div><div class="dl-go">Start →</div></div>';
  }else{
    var day=Math.floor(Date.now()/864e5),arr=insights().slice(0,5),i=arr.length?arr[day%arr.length]:null,t=null;
    if(!i)t=TIPS[day%TIPS.length];
    var title=i?i.title:'Money tip',text=i?i.text:t.t,lesson=i?i.lesson:t.l;
    h='<div class="dl-card" onclick="FinLearn.openLesson(\''+lesson+'\')"><div class="dl-e">'+(i?i.icon:'💡')+'</div><div class="dl-b"><div class="dl-t">'+esc(title)+'</div><div class="dl-x">'+esc(text)+'</div></div><div class="dl-go">Learn →</div></div>';
  }
  if(el._h===h)return;el._h=h;el.innerHTML=h;
}

/* ───────── public ───────── */
function openLesson(id){
  var l=LMAP[id];
  if(!l){show('learn');home();return}
  V={t:'lesson',id:id,i:0};
  try{if(window.closeSplashNow)closeSplashNow()}catch(e){}
  show('learn');render();
}
W.FinLearn={render:function(){try{render();renderDash()}catch(e){console.error('learn',e)}},
  open:openLesson,openLesson:openLesson,home:home,step:step,answer:answer,next:next,startQuiz:startQuiz,qpick:qpick,qnext:qnext,quitQuiz:quitQuiz,showResult:showResult,
  tipOfDay:tipOfDay,insights:insights,insightMessage:insightMessage,lessons:LESSONS,tips:TIPS,forms:{A:FORM_A,B:FORM_B},
  _state:function(){return LS()}};
})();