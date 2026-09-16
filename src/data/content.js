const unit = (id, level, title, subtitle, icon, lessons) => ({
  id, level, title, subtitle, icon,
  lessons: lessons.map(([slug, lessonTitle, type, topic, xp = 15]) => ({
    id: `${id}-${slug}`, title: lessonTitle, type, topic, level, xp,
  })),
});

export const contentVersion = '2.0.0';

export const levels = [
  { id: 'A1', title: 'A1 · Clinical Foundations', description: 'Essential words, body language and basic patient interaction.' },
  { id: 'A2', title: 'A2 · Everyday Nursing English', description: 'History taking, routine care, medications and basic charting.' },
  { id: 'B1', title: 'B1 · Clinical Assessment', description: 'System-based assessment, documentation and structured communication.' },
  { id: 'B2', title: 'B2 · Acute & Specialty Communication', description: 'Handoff, SBAR, perioperative care, emergencies and specialty nursing.' },
  { id: 'C1', title: 'C1 · Advanced Clinical Communication', description: 'Complex documentation, leadership language and integrated simulations.' },
];

export const units = [
  unit('a1-foundations', 'A1', 'Medical English Foundations', 'Core words used throughout healthcare', 'languages', [
    ['1', 'People & places in healthcare', 'vocabulary', 'foundations', 10],
    ['2', 'Body parts', 'vocabulary', 'anatomy', 10],
    ['3', 'Common symptoms', 'vocabulary', 'symptoms', 12],
    ['4', 'Basic clinical sentences', 'reading', 'foundations', 12],
  ]),
  unit('a1-vitals', 'A1', 'Vital Signs & Measurements', 'Numbers, measurements and simple observations', 'heartpulse', [
    ['1', 'Temperature & fever', 'vocabulary', 'vitals', 12],
    ['2', 'Pulse & blood pressure', 'vocabulary', 'vitals', 12],
    ['3', 'Respiratory rate & oxygen', 'reading', 'vitals', 14],
    ['4', 'Reporting vital signs', 'speaking', 'vitals', 14],
  ]),
  unit('a1-patient', 'A1', 'Basic Patient Interaction', 'Introduce yourself and ask simple questions', 'stethoscope', [
    ['1', 'Introducing yourself', 'speaking', 'communication', 12],
    ['2', 'Simple yes/no questions', 'interview', 'communication', 12],
    ['3', 'Needs & comfort', 'interview', 'daily-care', 12],
    ['4', 'Giving simple instructions', 'speaking', 'daily-care', 14],
  ]),
  unit('a1-mobility', 'A1', 'Mobility & Daily Care', 'Positioning, hygiene, feeding and mobility words', 'stethoscope', [
    ['1', 'Positions & movement', 'vocabulary', 'mobility', 12],
    ['2', 'Hygiene & self-care', 'vocabulary', 'daily-care', 12],
    ['3', 'Eating & drinking', 'reading', 'daily-care', 12],
    ['4', 'Safe mobility language', 'speaking', 'mobility', 14],
  ]),
  unit('a1-safety', 'A1', 'Basic Safety Language', 'Allergies, identification and simple safety checks', 'heartpulse', [
    ['1', 'Patient identification', 'reading', 'safety', 14],
    ['2', 'Allergy vocabulary', 'vocabulary', 'safety', 12],
    ['3', 'Falls & call bell language', 'speaking', 'safety', 14],
    ['4', 'A1 checkpoint', 'simulation', 'foundations', 18],
  ]),

  unit('a2-pain', 'A2', 'Pain & Symptom History', 'Describe symptoms with more precision', 'stethoscope', [
    ['1', 'Pain qualities', 'vocabulary', 'pain', 14],
    ['2', 'Pain location & radiation', 'interview', 'pain', 14],
    ['3', 'Severity & timing', 'interview', 'pain', 14],
    ['4', 'OPQRST introduction', 'interview', 'pain', 16],
  ]),
  unit('a2-history', 'A2', 'Health History', 'Collect a structured basic history', 'stethoscope', [
    ['1', 'Past medical history', 'interview', 'history', 14],
    ['2', 'Past surgical history', 'interview', 'history', 14],
    ['3', 'Allergies & medications', 'interview', 'medications', 14],
    ['4', 'Social & family history', 'interview', 'history', 16],
  ]),
  unit('a2-medications', 'A2', 'Medication English', 'Common routes, forms and medication language', 'languages', [
    ['1', 'Medication forms', 'vocabulary', 'medications', 14],
    ['2', 'Routes of administration', 'vocabulary', 'medications', 14],
    ['3', 'Medication schedule language', 'reading', 'medications', 16],
    ['4', 'Patient medication questions', 'speaking', 'medications', 16],
  ]),
  unit('a2-documentation', 'A2', 'Basic Nursing Documentation', 'Turn simple findings into professional sentences', 'penline', [
    ['1', 'Subjective vs objective', 'writing', 'documentation', 16],
    ['2', 'Useful charting verbs', 'writing', 'documentation', 16],
    ['3', 'Avoid vague language', 'writing', 'documentation', 16],
    ['4', 'Short nursing note', 'writing', 'documentation', 18],
  ]),
  unit('a2-care', 'A2', 'Routine Nursing Care', 'Fluids, elimination, skin and activity', 'heartpulse', [
    ['1', 'Intake & output', 'vocabulary', 'fluids', 14],
    ['2', 'Urinary & bowel terms', 'vocabulary', 'elimination', 14],
    ['3', 'Skin observations', 'clinical', 'skin', 16],
    ['4', 'A2 integrated case', 'simulation', 'daily-care', 20],
  ]),

  unit('b1-respiratory', 'B1', 'Respiratory Assessment', 'Interview, examine and document respiratory findings', 'stethoscope', [
    ['1', 'Respiratory symptoms', 'vocabulary', 'respiratory', 16],
    ['2', 'Respiratory interview', 'interview', 'respiratory', 18],
    ['3', 'Breath sounds & work of breathing', 'clinical', 'respiratory', 18],
    ['4', 'Respiratory documentation', 'writing', 'respiratory', 20],
  ]),
  unit('b1-cardio', 'B1', 'Cardiovascular Assessment', 'Cardiac symptoms, circulation and documentation', 'heartpulse', [
    ['1', 'Cardiovascular symptoms', 'vocabulary', 'cardiovascular', 16],
    ['2', 'Cardiac interview', 'interview', 'cardiovascular', 18],
    ['3', 'Perfusion & edema findings', 'clinical', 'cardiovascular', 18],
    ['4', 'Cardiovascular documentation', 'writing', 'cardiovascular', 20],
  ]),
  unit('b1-neuro', 'B1', 'Neurological Assessment', 'Mental status, pupils, strength and symptoms', 'stethoscope', [
    ['1', 'Neurological vocabulary', 'vocabulary', 'neurological', 16],
    ['2', 'Mental status interview', 'interview', 'neurological', 18],
    ['3', 'Pupils, strength & sensation', 'clinical', 'neurological', 18],
    ['4', 'Neurological documentation', 'writing', 'neurological', 20],
  ]),
  unit('b1-gi-gu', 'B1', 'GI & GU Assessment', 'Digestive and urinary clinical English', 'stethoscope', [
    ['1', 'GI symptoms', 'vocabulary', 'gastrointestinal', 16],
    ['2', 'Abdominal assessment language', 'clinical', 'gastrointestinal', 18],
    ['3', 'GU symptoms & output', 'vocabulary', 'genitourinary', 16],
    ['4', 'GI/GU documentation', 'writing', 'gastrointestinal', 20],
  ]),
  unit('b1-communication', 'B1', 'Structured Clinical Communication', 'SBAR basics and nurse-to-nurse communication', 'languages', [
    ['1', 'SBAR structure', 'reading', 'sbar', 18],
    ['2', 'Situation & background', 'speaking', 'sbar', 18],
    ['3', 'Assessment & recommendation', 'speaking', 'sbar', 18],
    ['4', 'B1 handoff case', 'simulation', 'handoff', 22],
  ]),

  unit('b2-handoff', 'B2', 'Handoff & Care Coordination', 'Concise, complete transfer of clinical information', 'languages', [
    ['1', 'Handoff priorities', 'reading', 'handoff', 18],
    ['2', 'Pending tasks & follow-up', 'speaking', 'handoff', 20],
    ['3', 'Interprofessional clarification', 'speaking', 'communication', 20],
    ['4', 'Shift-change simulation', 'simulation', 'handoff', 24],
  ]),
  unit('b2-acute', 'B2', 'Acute Changes & Escalation', 'Describe deterioration clearly and objectively', 'heartpulse', [
    ['1', 'Acute respiratory change', 'clinical', 'respiratory', 20],
    ['2', 'Hemodynamic change', 'clinical', 'cardiovascular', 20],
    ['3', 'Neurological change', 'clinical', 'neurological', 20],
    ['4', 'Escalation SBAR', 'simulation', 'sbar', 24],
  ]),
  unit('b2-periop', 'B2', 'Perioperative & PACU English', 'Surgery, recovery and postoperative communication', 'heartpulse', [
    ['1', 'Pre-op vocabulary', 'vocabulary', 'perioperative', 18],
    ['2', 'PACU respiratory language', 'clinical', 'pacu', 20],
    ['3', 'Pain, nausea & recovery', 'interview', 'pacu', 20],
    ['4', 'Post-op nursing note', 'writing', 'perioperative', 22],
  ]),
  unit('b2-wound', 'B2', 'Wound & Infection Language', 'Describe wounds without vague or unsupported conclusions', 'penline', [
    ['1', 'Wound descriptors', 'vocabulary', 'wound', 18],
    ['2', 'Drainage & surrounding skin', 'clinical', 'wound', 20],
    ['3', 'Objective wound charting', 'writing', 'wound', 20],
    ['4', 'Wound case documentation', 'simulation', 'wound', 24],
  ]),
  unit('b2-specialties', 'B2', 'Specialty Nursing English', 'ICU, emergency and mental-health communication', 'stethoscope', [
    ['1', 'ICU monitoring language', 'reading', 'icu', 20],
    ['2', 'Emergency triage language', 'interview', 'emergency', 20],
    ['3', 'Mental-health communication', 'speaking', 'mental-health', 20],
    ['4', 'Specialty case challenge', 'simulation', 'specialties', 24],
  ]),

  unit('c1-documentation', 'C1', 'Advanced Clinical Documentation', 'Concise, defensible and clinically meaningful notes', 'penline', [
    ['1', 'High-value documentation', 'writing', 'documentation', 22],
    ['2', 'Trend language', 'writing', 'documentation', 22],
    ['3', 'Intervention & response', 'writing', 'documentation', 22],
    ['4', 'Complex progress note', 'simulation', 'documentation', 26],
  ]),
  unit('c1-leadership', 'C1', 'Leadership & Conflict Communication', 'Escalation, disagreement and professional assertiveness', 'languages', [
    ['1', 'Closed-loop communication', 'speaking', 'leadership', 22],
    ['2', 'Clarifying unsafe ambiguity', 'speaking', 'leadership', 22],
    ['3', 'Professional disagreement', 'speaking', 'leadership', 22],
    ['4', 'Conflict scenario', 'simulation', 'leadership', 26],
  ]),
  unit('c1-education', 'C1', 'Patient Education & Health Literacy', 'Explain complex information in clear patient-centered English', 'languages', [
    ['1', 'Plain-language explanations', 'speaking', 'education', 22],
    ['2', 'Teach-back language', 'speaking', 'education', 22],
    ['3', 'Discharge instructions', 'reading', 'education', 22],
    ['4', 'Education simulation', 'simulation', 'education', 26],
  ]),
  unit('c1-complex', 'C1', 'Complex Clinical Reasoning Language', 'Synthesize multiple findings without overclaiming', 'stethoscope', [
    ['1', 'Prioritizing relevant findings', 'reading', 'reasoning', 22],
    ['2', 'Uncertainty & cautious language', 'writing', 'reasoning', 22],
    ['3', 'Comparing trends', 'clinical', 'reasoning', 22],
    ['4', 'Multisystem case', 'simulation', 'reasoning', 28],
  ]),
  unit('c1-capstone', 'C1', 'Clinical English Capstone', 'Interview → assessment → handoff → documentation', 'heartpulse', [
    ['1', 'Comprehensive interview', 'interview', 'capstone', 24],
    ['2', 'Focused physical assessment', 'clinical', 'capstone', 24],
    ['3', 'Advanced handoff', 'speaking', 'capstone', 24],
    ['4', 'Final integrated simulation', 'simulation', 'capstone', 30],
  ]),
];

const vocabulary = [
  ['patient','a person receiving healthcare','A1','foundations'],['nurse','a professional who provides nursing care','A1','foundations'],['ward','an area of a hospital where patients receive care','A1','foundations'],['clinic','a place where outpatient healthcare is provided','A1','foundations'],['bedside','the area next to the patient’s bed','A1','foundations'],
  ['chest','the front part of the body between the neck and abdomen','A1','anatomy'],['abdomen','the body region between the chest and pelvis','A1','anatomy'],['calf','the back portion of the lower leg','A1','anatomy'],['wrist','the joint between the hand and forearm','A1','anatomy'],['ankle','the joint between the foot and lower leg','A1','anatomy'],
  ['pain','an unpleasant sensory or emotional experience','A1','symptoms'],['cough','a sudden expulsion of air from the lungs','A1','symptoms'],['fever','an elevated body temperature','A1','vitals'],['nausea','the feeling that you may vomit','A1','symptoms'],['dizziness','a broad term for disturbed spatial orientation or unsteadiness','A1','symptoms'],
  ['pulse','the palpable rhythmic expansion of an artery','A1','vitals'],['blood pressure','the pressure of circulating blood against vessel walls','A1','vitals'],['respiratory rate','the number of breaths taken per minute','A1','vitals'],['oxygen saturation','the percentage of hemoglobin carrying oxygen','A1','vitals'],['temperature','a measurement of body heat','A1','vitals'],
  ['supine','lying flat on the back','A1','mobility'],['prone','lying on the abdomen','A1','mobility'],['upright','positioned with the torso vertical or elevated','A1','mobility'],['ambulate','to walk or move about','A1','mobility'],['transfer','to move a patient from one surface or place to another','A1','mobility'],

  ['sharp','a pain quality often described as cutting or stabbing','A2','pain'],['dull','a pain quality that is less intense and not sharp','A2','pain'],['burning','a pain quality resembling heat or fire','A2','pain'],['throbbing','a rhythmic pulsating pain quality','A2','pain'],['radiating','spreading from one location to another','A2','pain'],
  ['allergy','an immune reaction to a substance','A2','medications'],['tablet','a compressed solid medication form','A2','medications'],['capsule','a medication enclosed in a soluble shell','A2','medications'],['intravenous','administered into a vein','A2','medications'],['intramuscular','administered into a muscle','A2','medications'],['subcutaneous','administered into the tissue beneath the skin','A2','medications'],['oral','administered by mouth','A2','medications'],
  ['void','to urinate','A2','elimination'],['urine output','the amount of urine produced over a period of time','A2','elimination'],['bowel movement','passage of stool from the body','A2','elimination'],['constipation','infrequent or difficult passage of stool','A2','elimination'],['diarrhea','frequent loose or watery stools','A2','elimination'],
  ['redness','visible red discoloration of the skin','A2','skin'],['bruising','skin discoloration caused by bleeding under the skin','A2','skin'],['intact','not broken or damaged','A2','skin'],['drainage','fluid leaving a wound, incision or tube','A2','skin'],['tenderness','pain or discomfort produced by touch or palpation','A2','skin'],

  ['dyspnea','the sensation of difficult or uncomfortable breathing','B1','respiratory'],['wheezing','a musical breath sound commonly heard during narrowed airflow','B1','respiratory'],['crackles','discontinuous popping breath sounds heard on auscultation','B1','respiratory'],['sputum','material coughed up from the lower respiratory tract','B1','respiratory'],['orthopnea','shortness of breath when lying flat','B1','respiratory'],['accessory muscles','muscles recruited to assist breathing when effort is increased','B1','respiratory'],
  ['palpitations','an awareness of the heartbeat','B1','cardiovascular'],['edema','swelling caused by excess fluid in tissues','B1','cardiovascular'],['perfusion','delivery of blood to tissue capillary beds','B1','cardiovascular'],['capillary refill','the time for color to return after blanching tissue','B1','cardiovascular'],['cyanosis','bluish discoloration associated with reduced oxygenation of tissues','B1','cardiovascular'],
  ['alert','awake and responsive','B1','neurological'],['oriented','aware of person, place, time or situation as assessed','B1','neurological'],['pupil','the central opening of the iris','B1','neurological'],['weakness','reduced muscle strength','B1','neurological'],['numbness','reduced or absent sensation','B1','neurological'],['tingling','a pins-and-needles sensation','B1','neurological'],
  ['distention','abnormal enlargement or swelling of a body region','B1','gastrointestinal'],['bowel sounds','sounds produced by movement within the gastrointestinal tract','B1','gastrointestinal'],['dysuria','pain or discomfort with urination','B1','genitourinary'],['hematuria','blood in the urine','B1','genitourinary'],

  ['handoff','structured transfer of responsibility and relevant patient information','B2','handoff'],['pending','not yet completed or resulted','B2','handoff'],['baseline','a reference point used for comparison over time','B2','handoff'],['deterioration','a decline in a patient’s condition','B2','communication'],['escalation','communication to obtain a higher level of review or response','B2','communication'],
  ['incision','a surgical cut made through tissue','B2','perioperative'],['emergence','the period of recovery from anesthesia','B2','pacu'],['airway','the passage through which air moves into and out of the lungs','B2','pacu'],['sedation','a drug-induced reduction in awareness or responsiveness','B2','pacu'],['incisional pain','pain located at a surgical incision','B2','perioperative'],
  ['erythema','redness of the skin','B2','wound'],['purulent','containing or resembling pus','B2','wound'],['serous','clear or pale-yellow watery drainage','B2','wound'],['serosanguineous','drainage containing both serum and blood','B2','wound'],['dehiscence','partial or complete separation of wound edges','B2','wound'],
  ['hemodynamic','relating to blood flow and circulatory function','B2','icu'],['telemetry','remote electronic monitoring of physiologic signals such as heart rhythm','B2','icu'],['triage','sorting patients according to urgency and care needs','B2','emergency'],['agitation','increased motor or emotional restlessness','B2','mental-health'],['de-escalation','communication strategies intended to reduce tension and agitation','B2','mental-health'],

  ['trend','the direction of change across repeated observations','C1','documentation'],['reassessment','a repeat assessment performed after time or intervention','C1','documentation'],['response','the patient’s change or reaction following an intervention','C1','documentation'],['concise','brief while retaining essential information','C1','documentation'],['pertinent','directly relevant to the clinical situation','C1','documentation'],
  ['closed-loop communication','a communication method in which a message is acknowledged and confirmed','C1','leadership'],['clarification','a request or statement that makes information more precise','C1','leadership'],['assertive','clear and respectful communication of concerns or needs','C1','leadership'],['teach-back','asking a patient to explain information in their own words to check understanding','C1','education'],['health literacy','the ability to find, understand and use health information','C1','education'],['plain language','communication designed to be understandable without unnecessary technical jargon','C1','education'],
  ['uncertain','not established with enough information to state as fact','C1','reasoning'],['consistent with','language indicating compatibility with a finding without claiming certainty','C1','reasoning'],['compared with baseline','language used to describe change relative to a prior reference point','C1','reasoning'],['priority finding','information that is especially relevant to immediate communication or follow-up','C1','reasoning'],['synthesize','to combine multiple pieces of information into a coherent summary','C1','capstone'],
];

const phrasePairs = [
  ['The patient says he is bad.','Patient reports feeling unwell.','A2','documentation'],
  ['The wound looks infected.','Incision with surrounding erythema, warmth and purulent drainage.','A2','documentation'],
  ['Patient refers pain.','Patient reports pain.','A2','documentation'],
  ['Make an examination.','Perform an examination.','A2','documentation'],
  ['The patient cannot breathe good.','Patient reports difficulty breathing.','A2','documentation'],
  ['Patient is okay.','Patient is alert, speaking in full sentences and denies acute complaints.','B1','documentation'],
  ['Lungs are bad.','Bilateral expiratory wheezing noted on auscultation.','B1','respiratory'],
  ['Leg has fluid.','Pitting edema noted at the lower extremity.','B1','cardiovascular'],
  ['Patient is confused.','Patient is disoriented to time and place.','B1','neurological'],
  ['Belly is swollen.','Abdomen appears distended.','B1','gastrointestinal'],
  ['Urine is weird.','Urine appears dark and cloudy.','B1','genitourinary'],
  ['The dressing is good.','Dressing clean, dry and intact.','B1','documentation'],
  ['He got worse.','Patient demonstrates increased work of breathing compared with prior assessment.','B2','respiratory'],
  ['Blood pressure is bad.','Blood pressure decreased from 118/72 to 86/54 mmHg.','B2','cardiovascular'],
  ['The wound is opening.','Separation of the incision edges noted.','B2','wound'],
  ['Patient is sleepy.','Patient arouses to voice but remains drowsy between interactions.','B2','pacu'],
  ['She is crazy and angry.','Patient appears agitated, pacing and speaking loudly.','B2','mental-health'],
  ['Everything is stable.','No clinically significant change noted from the previous assessment.','C1','documentation'],
  ['Patient did better after treatment.','On reassessment, respiratory rate decreased and patient reports improved dyspnea.','C1','documentation'],
  ['I think he has an infection.','Findings include fever, erythema and purulent drainage; provider notified for further evaluation.','C1','reasoning'],
  ['Maybe stroke.','New unilateral weakness and speech difficulty noted; urgent evaluation initiated per local protocol.','C1','reasoning'],
  ['The family does not understand.','Family requested clarification regarding the care plan; information was reviewed using plain language.','C1','education'],
  ['Doctor ignored me.','Concern was restated using objective findings and escalation pathway was followed.','C1','leadership'],
  ['Patient knows the instructions.','Patient accurately explained the instructions using teach-back.','C1','education'],
  ['Lots of things are wrong.','Priority findings include worsening oxygenation, increased respiratory effort and new confusion.','C1','reasoning'],
];

const manualQuestions = [
  ['a1-q1','A1','reading','foundations','Read: “The nurse is at the bedside.” Where is the nurse?',['Next to the patient’s bed','In the pharmacy','Outside the hospital','In the laboratory'],'Next to the patient’s bed','Bedside means the area next to the patient’s bed.'],
  ['a1-q2','A1','interview','communication','Which is the most natural introduction?',['Hello, I am your nurse today. My name is Alex.','I nurse. You patient.','Give me your arm.','You are here why?'],'Hello, I am your nurse today. My name is Alex.','A simple introduction should identify your role and name clearly.'],
  ['a1-q3','A1','speaking','daily-care','Which instruction is clearest?',['Please sit on the edge of the bed.','Do the bed edge.','Move somewhere.','Stand maybe.'],'Please sit on the edge of the bed.','Use direct, simple verbs and a clear location.'],
  ['a1-q4','A1','reading','safety','Which two identifiers are examples of patient identification information?',['Full name and date of birth','Room color and meal choice','Hair color and blanket color','Visitor name and parking space'],'Full name and date of birth','Identification practices depend on local policy; name and date of birth are common identifiers.'],
  ['a1-q5','A1','simulation','foundations','A patient says “I feel sick.” What is the best simple follow-up?',['Can you tell me what you are feeling?','Okay, goodbye.','You are wrong.','Do not talk.'],'Can you tell me what you are feeling?','Open-ended clarification helps the patient describe the problem.'],

  ['a2-q1','A2','interview','pain','Which question assesses pain severity?',['On a scale from 0 to 10, how severe is the pain?','What is your address?','Did you sleep last year?','What color is the pain?'],'On a scale from 0 to 10, how severe is the pain?','Severity can be explored with a rating scale when appropriate.'],
  ['a2-q2','A2','interview','pain','Which question explores radiation?',['Does the pain move or spread anywhere else?','Do you have allergies?','When was your last meal?','Can you spell your name?'],'Does the pain move or spread anywhere else?','Radiation refers to pain spreading from one location to another.'],
  ['a2-q3','A2','reading','medications','Read: “Take one tablet by mouth twice daily.” Which route is described?',['Oral','Intravenous','Intramuscular','Topical'],'Oral','By mouth means the oral route.'],
  ['a2-q4','A2','writing','documentation','Which sentence contains a subjective finding?',['Patient reports nausea.','Temperature is 38.2°C.','Skin is warm to touch.','Urine output is 450 mL.'],'Patient reports nausea.','A patient-reported symptom is subjective information.'],
  ['a2-q5','A2','clinical','skin','Which phrase is most objective?',['Bruising noted over the left forearm.','The arm looks terrible.','The skin seems wrong.','Probably injured.'],'Bruising noted over the left forearm.','Objective charting describes observable findings.'],
  ['a2-q6','A2','simulation','daily-care','A patient asks for help walking to the bathroom. Which response is clearest?',['I will help you stand and walk safely to the bathroom.','Go yourself.','Bathroom over there.','Maybe later.'],'I will help you stand and walk safely to the bathroom.','Clear language explains the plan and support being offered.'],

  ['b1-q1','B1','interview','respiratory','Which question best explores dyspnea timing?',['When did the shortness of breath begin?','What is your favorite drink?','How tall are you?','Who drove you here?'],'When did the shortness of breath begin?','This directly explores onset.'],
  ['b1-q2','B1','clinical','respiratory','Which finding best supports increased work of breathing?',['Use of accessory muscles','Warm hands','Normal appetite','Intact skin'],'Use of accessory muscles','Accessory muscle use is an observable sign of increased respiratory effort.'],
  ['b1-q3','B1','writing','respiratory','Which note is most specific?',['SpO₂ 92% on 2 L/min via nasal cannula.','Oxygen is okay.','Breathing seems fine.','Patient has air.'],'SpO₂ 92% on 2 L/min via nasal cannula.','Specific measurements and oxygen-delivery information are more useful than vague wording.'],
  ['b1-q4','B1','interview','cardiovascular','Which question is most relevant to palpitations?',['Can you describe what your heartbeat feels like and when it occurs?','What did you eat three years ago?','Do you prefer mornings?','What is your shoe size?'],'Can you describe what your heartbeat feels like and when it occurs?','This explores the symptom in a focused way.'],
  ['b1-q5','B1','clinical','cardiovascular','Which phrase describes tissue blood flow?',['Perfusion','Sedation','Drainage','Distention'],'Perfusion','Perfusion refers to blood flow through tissue capillary beds.'],
  ['b1-q6','B1','writing','neurological','Which documentation is most precise?',['Patient oriented to person and place, disoriented to time.','Patient kind of confused.','Brain status bad.','Patient not normal.'],'Patient oriented to person and place, disoriented to time.','Document the specific orientation findings rather than a vague label.'],
  ['b1-q7','B1','clinical','gastrointestinal','Which sentence is a focused abdominal finding?',['Abdomen soft and non-distended.','Stomach good.','Patient looks okay.','No problems anywhere.'],'Abdomen soft and non-distended.','Focused documentation describes the assessed body system.'],
  ['b1-q8','B1','reading','sbar','In SBAR, where do current assessment findings belong?',['Assessment','Situation only','Background only','Greeting'],'Assessment','The Assessment section communicates current findings and your assessment of the situation.'],
  ['b1-q9','B1','speaking','sbar','Which opening is most concise for the Situation?',['I am calling about Ms. Chen because her oxygen saturation has fallen to 88%.','I wanted to talk about many things.','Something is strange.','I have a patient here.'],'I am calling about Ms. Chen because her oxygen saturation has fallen to 88%.','Situation should quickly identify the patient and immediate concern.'],
  ['b1-q10','B1','simulation','handoff','Which item is most important to include in a handoff?',['Relevant current status and pending care needs','Your weekend plans','Unrelated details from years ago','The color of the room'],'Relevant current status and pending care needs','Handoff should prioritize information needed for safe continuity of care.'],

  ['b2-q1','B2','reading','handoff','Which statement best identifies a pending task?',['Repeat CBC is ordered and has not yet resulted.','The patient likes tea.','The room is quiet.','The television is on.'],'Repeat CBC is ordered and has not yet resulted.','Pending tests and tasks are important to continuity of care.'],
  ['b2-q2','B2','speaking','communication','Which phrase professionally requests clarification?',['Could you clarify the intended dose and timing?','That makes no sense.','You are wrong.','Whatever.'],'Could you clarify the intended dose and timing?','Professional clarification focuses on the specific ambiguity.'],
  ['b2-q3','B2','clinical','respiratory','Which statement best communicates a change from baseline?',['Respiratory rate increased from 18 to 30/min with new accessory muscle use.','Breathing is worse.','Patient looks scary.','Lungs bad now.'],'Respiratory rate increased from 18 to 30/min with new accessory muscle use.','Trend plus new objective findings communicate deterioration clearly.'],
  ['b2-q4','B2','clinical','cardiovascular','Which statement best describes a hemodynamic change?',['BP decreased from 124/76 to 86/52 mmHg; patient reports dizziness.','Pressure bad.','Patient does not look right.','Heart situation changed.'],'BP decreased from 124/76 to 86/52 mmHg; patient reports dizziness.','Specific measurements and symptoms make the change clear.'],
  ['b2-q5','B2','clinical','neurological','Which finding is most important to state specifically?',['New unilateral arm weakness','Patient weird','Patient tired','Patient quiet'],'New unilateral arm weakness','A new focal neurological finding should be described directly and objectively.'],
  ['b2-q6','B2','clinical','pacu','Which phrase best describes drowsiness after a procedure?',['Patient arouses to voice but quickly returns to sleep.','Patient is lazy.','Patient does not care.','Patient is being difficult.'],'Patient arouses to voice but quickly returns to sleep.','Describe observable responsiveness rather than assigning motives.'],
  ['b2-q7','B2','interview','pacu','Which question best assesses postoperative nausea?',['Are you feeling nauseated or like you may vomit?','Do you like the hospital?','Is the room nice?','Can you name five countries?'],'Are you feeling nauseated or like you may vomit?','Use clear patient-centered language for symptoms.'],
  ['b2-q8','B2','writing','wound','Which note best describes drainage?',['Small amount of serosanguineous drainage noted on dressing.','Dressing has gross stuff.','Wound leaking something.','It is infected.'],'Small amount of serosanguineous drainage noted on dressing.','Amount and character of drainage are useful objective descriptors.'],
  ['b2-q9','B2','interview','emergency','Which question efficiently clarifies a sudden symptom?',['What were you doing when it started, and what did you feel first?','Tell me your whole life story.','What is your favorite season?','Do you know this hospital?'],'What were you doing when it started, and what did you feel first?','A focused onset question supports efficient acute assessment.'],
  ['b2-q10','B2','speaking','mental-health','Which response is most de-escalating?',['I can see you are upset. I want to understand what you need right now.','Calm down immediately.','Stop behaving like that.','You are being unreasonable.'],'I can see you are upset. I want to understand what you need right now.','Calm, respectful acknowledgment and clarification can support de-escalation.'],
  ['b2-q11','B2','simulation','sbar','A patient has a new drop in BP. Which SBAR sentence is strongest?',['Situation: BP has fallen to 84/50 mmHg from a prior 118/70, and the patient reports lightheadedness.','Situation: patient bad.','Situation: not sure what is happening.','Situation: please come sometime.'],'Situation: BP has fallen to 84/50 mmHg from a prior 118/70, and the patient reports lightheadedness.','State the current concern with relevant objective context.'],

  ['c1-q1','C1','writing','documentation','Which note best documents intervention and response?',['Repositioned patient upright; on reassessment, dyspnea decreased and SpO₂ improved from 91% to 95% on prescribed oxygen.','Helped patient and better.','Did intervention; good result.','Patient seems improved.'],'Repositioned patient upright; on reassessment, dyspnea decreased and SpO₂ improved from 91% to 95% on prescribed oxygen.','Advanced documentation links intervention to a measurable or reported response.'],
  ['c1-q2','C1','writing','reasoning','Which phrase appropriately communicates uncertainty?',['Findings are consistent with, but do not by themselves establish, the cause of the symptoms.','This definitely proves the diagnosis.','I know exactly what it is.','No uncertainty exists.'],'Findings are consistent with, but do not by themselves establish, the cause of the symptoms.','Use cautious language when the available information does not establish a diagnosis.'],
  ['c1-q3','C1','reading','reasoning','Which summary best prioritizes information?',['Priority findings are worsening oxygenation, increased respiratory effort and new confusion.','The patient has many things going on.','Everything in the chart is equally urgent.','The room is busy.'],'Priority findings are worsening oxygenation, increased respiratory effort and new confusion.','A strong synthesis highlights the findings most relevant to the current problem.'],
  ['c1-q4','C1','speaking','leadership','Which phrase demonstrates assertive professional concern?',['I am concerned about the new hypotension and change in mental status; I need an urgent review.','You never listen to me.','This is all your fault.','Whatever you want.'],'I am concerned about the new hypotension and change in mental status; I need an urgent review.','Assertive communication names the concern and clearly states the need.'],
  ['c1-q5','C1','speaking','leadership','Which phrase uses closed-loop communication?',['“Give 1 mg now.” — “Confirming 1 mg now.” — “Correct.”','“Do something.” — silence','“Maybe give it.” — “Okay maybe.”','“You know what I mean.”'],'“Give 1 mg now.” — “Confirming 1 mg now.” — “Correct.”','Closed-loop communication includes acknowledgment and confirmation.'],
  ['c1-q6','C1','speaking','education','Which statement best uses teach-back?',['To make sure I explained it clearly, can you tell me how you will take this medicine at home?','Do you understand?','You understood everything, right?','Please sign here.'],'To make sure I explained it clearly, can you tell me how you will take this medicine at home?','Teach-back checks understanding without blaming the patient.'],
  ['c1-q7','C1','reading','education','Which discharge instruction uses the clearest plain language?',['Call your care team if the incision becomes more red, swollen or begins draining pus.','Observe for progressive peri-incisional inflammatory manifestations.','Monitor integumentary aberrations.','Assess for pathophysiologic wound phenomena.'],'Call your care team if the incision becomes more red, swollen or begins draining pus.','Plain language minimizes unnecessary jargon.'],
  ['c1-q8','C1','clinical','reasoning','Which sentence most clearly describes a trend?',['Over four hours, HR increased from 88 to 116 bpm while urine output decreased.','Vitals changed.','Things are moving.','Patient is different.'],'Over four hours, HR increased from 88 to 116 bpm while urine output decreased.','A trend includes direction, time and measurable data.'],
  ['c1-q9','C1','simulation','capstone','Which handoff summary is strongest?',['Post-op day 1; alert, on 2 L/min nasal cannula, pain controlled, incision clean/dry/intact, ambulating with assistance, repeat CBC pending.','Patient okay after surgery.','Nothing much to say.','Read the chart later.'],'Post-op day 1; alert, on 2 L/min nasal cannula, pain controlled, incision clean/dry/intact, ambulating with assistance, repeat CBC pending.','A strong handoff is concise but includes status, key care needs and pending items.'],
  ['c1-q10','C1','interview','capstone','A patient gives a long, unfocused story. Which response respectfully refocuses the interview?',['I want to make sure I understand the main problem today. Can we return to when the shortness of breath began?','Stop talking.','That is irrelevant.','Please answer correctly.'],'I want to make sure I understand the main problem today. Can we return to when the shortness of breath began?','Professional redirection acknowledges the patient while returning to the clinical goal.'],
  ['c1-q11','C1','simulation','reasoning','Which documentation avoids overclaiming?',['New fever and purulent wound drainage noted; findings communicated for further evaluation.','Patient definitely has a wound infection.','The diagnosis is obvious.','No further assessment is needed.'],'New fever and purulent wound drainage noted; findings communicated for further evaluation.','Document findings and actions without asserting a diagnosis beyond available evidence or scope.'],
];

const communicationQuestions = [
  ['A1','communication','Hello, my name is Jordan, and I will be your nurse today.'],
  ['A1','daily-care','Please use the call bell if you need help getting out of bed.'],
  ['A1','vitals','Your blood pressure is 118 over 72.'],
  ['A2','pain','Can you point to where the pain is strongest?'],
  ['A2','history','Have you ever had surgery before?'],
  ['A2','medications','Do you take any medicines every day?'],
  ['B1','respiratory','When did the shortness of breath begin?'],
  ['B1','cardiovascular','Have you noticed swelling in your legs or ankles?'],
  ['B1','neurological','Do you have any new numbness, tingling or weakness?'],
  ['B1','sbar','I am calling because the patient has developed new hypotension.'],
  ['B2','handoff','The repeat laboratory result is still pending and should be followed up on this shift.'],
  ['B2','pacu','The patient is drowsy but arouses to voice and follows simple commands.'],
  ['B2','mental-health','I want to understand what is making you feel unsafe right now.'],
  ['C1','leadership','I am concerned about this change from baseline and would like an urgent review.'],
  ['C1','education','To make sure I explained it clearly, can you tell me what you will do when you get home?'],
  ['C1','capstone','Priority findings are worsening oxygenation, increased work of breathing and new confusion.'],
];

const vocabQuestions = vocabulary.flatMap(([term, meaning, level, topic], index) => {
  const sameLevel = vocabulary.filter((item) => item[2] === level && item[0] !== term);
  const distractorMeanings = [0, 1, 2].map((offset) => sameLevel[(index * 3 + offset) % sameLevel.length]?.[1]).filter(Boolean);
  const distractorTerms = [0, 1, 2].map((offset) => sameLevel[(index * 5 + offset + 2) % sameLevel.length]?.[0]).filter(Boolean);
  return [
    { id: `v-${index}-a`, level, topic, type: 'vocabulary', prompt: `What does “${term}” mean?`, options: [meaning, ...distractorMeanings], answer: meaning, tip: `${term}: ${meaning}.` },
    { id: `v-${index}-b`, level, topic, type: 'vocabulary', prompt: `Which clinical term means “${meaning}”?`, options: [term, ...distractorTerms], answer: term, tip: `The correct term is “${term}”.` },
  ];
});

const writingQuestions = phrasePairs.map(([weak, strong, level, topic], index) => ({
  id: `w-${index}`, level, topic, type: 'writing',
  prompt: `Choose the strongest professional rewrite: “${weak}”`,
  options: [strong, weak, 'No documentation is needed.', 'Use a vague description instead.'],
  answer: strong,
  tip: 'Clinical writing should favor specific, objective and professionally neutral language.',
}));

const speakingQuestions = communicationQuestions.map(([level, topic, answer], index) => ({
  id: `s-${index}`, level, topic, type: 'speaking',
  prompt: 'Which phrase is the clearest professional clinical communication?',
  options: [answer, 'Something is wrong with this patient.', 'You know what I mean.', 'I am not sure, just look at the chart.'],
  answer,
  tip: 'Clear communication identifies the relevant concern, request or information directly.',
}));

const handcrafted = manualQuestions.map(([id, level, type, topic, prompt, options, answer, tip]) => ({ id, level, type, topic, prompt, options, answer, tip }));
const allQuestions = [...vocabQuestions, ...writingQuestions, ...speakingQuestions, ...handcrafted];

function hash(text) {
  let value = 0;
  for (let i = 0; i < text.length; i += 1) value = ((value << 5) - value + text.charCodeAt(i)) | 0;
  return Math.abs(value);
}

function lessonCandidates(lesson) {
  const exact = allQuestions.filter((q) => q.level === lesson.level && q.topic === lesson.topic && q.type === lesson.type);
  const sameTopic = allQuestions.filter((q) => q.level === lesson.level && q.topic === lesson.topic);
  const sameType = allQuestions.filter((q) => q.level === lesson.level && q.type === lesson.type);
  const sameLevel = allQuestions.filter((q) => q.level === lesson.level);
  const simulationTypes = ['simulation','clinical','interview','writing','speaking','reading'];
  const simulationPool = lesson.type === 'simulation'
    ? allQuestions.filter((q) => q.level === lesson.level && (q.topic === lesson.topic || q.topic === 'documentation' || q.topic === 'sbar' || q.topic === 'handoff') && simulationTypes.includes(q.type))
    : [];
  const combined = [...exact, ...simulationPool, ...sameTopic, ...sameType, ...sameLevel];
  return [...new Map(combined.map((q) => [q.id, q])).values()];
}

export const lessonQuestions = Object.fromEntries(
  units.flatMap((u) => u.lessons).map((lesson) => {
    const pool = lessonCandidates(lesson);
    const ordered = [...pool].sort((a, b) => hash(`${lesson.id}-${a.id}`) - hash(`${lesson.id}-${b.id}`));
    return [lesson.id, ordered.slice(0, Math.min(6, ordered.length))];
  }),
);

export const reviewWords = vocabulary.map(([term, meaning, level, topic]) => ({ term, meaning, level, topic }));
export const speakingPhrases = communicationQuestions.map((item) => item[2]);

export const nursingCases = [
  {
    id: 'respiratory-pneumonia', level: 'B1', title: 'Respiratory Assessment', patient: '67-year-old patient admitted with community-acquired pneumonia',
    findings: ['Alert and oriented ×4','BP 128/76 mmHg · HR 88 bpm · RR 20/min','SpO₂ 94% on 2 L/min via nasal cannula','Reports dyspnea on exertion and productive cough','Crackles at the right lung base','Denies chest pain'],
    required: [['Mental status',['alert','oriented'],14],['Oxygenation',['spo2','94%','nasal cannula','2 l'],16],['Respiratory symptoms',['dyspnea','shortness of breath','productive cough'],16],['Lung finding',['crackle','right lung base'],16],['Chest pain status',['denies chest pain','no chest pain'],12]],
    model: 'Patient alert and oriented ×4. BP 128/76 mmHg, HR 88 bpm, RR 20/min. SpO₂ 94% on 2 L/min via nasal cannula. Reports dyspnea on exertion and productive cough. Crackles noted at the right lung base. Denies chest pain.'
  },
  {
    id: 'postop', level: 'B2', title: 'Postoperative Assessment', patient: '54-year-old patient, postoperative day 1 after abdominal surgery',
    findings: ['Alert and oriented','Pain 6/10 at incision','BP 116/70 mmHg · HR 96 bpm','SpO₂ 96% on room air','Abdominal dressing clean, dry and intact','Ambulates with assistance','Reports mild nausea'],
    required: [['Mental status',['alert','oriented'],12],['Pain',['pain','6/10','incision'],16],['Oxygenation',['spo2','96%','room air'],14],['Dressing',['clean','dry','intact','dressing'],16],['Mobility',['ambulat','assistance'],14],['Nausea',['nausea'],10]],
    model: 'Patient alert and oriented. Reports incisional pain 6/10 and mild nausea. BP 116/70 mmHg, HR 96 bpm, SpO₂ 96% on room air. Abdominal dressing clean, dry and intact. Ambulating with assistance.'
  },
  {
    id: 'neuro', level: 'B1', title: 'Neurological Assessment', patient: '72-year-old patient evaluated for new confusion',
    findings: ['Awake and cooperative','Oriented to person and place; disoriented to time','Pupils equal and reactive','Moves all extremities','Denies numbness or tingling','Family reports confusion began this morning'],
    required: [['Orientation',['oriented','disoriented','time'],18],['Pupils',['pupil','equal','reactive'],14],['Motor',['moves all extremities','strength'],12],['Sensation',['denies numbness','tingling'],12],['Onset',['this morning','family reports'],12]],
    model: 'Patient awake and cooperative, oriented to person and place but disoriented to time. Pupils equal and reactive. Moves all extremities and denies numbness or tingling. Family reports confusion began this morning.'
  },
  {
    id: 'wound', level: 'B2', title: 'Wound Documentation', patient: 'Patient with a lower abdominal surgical incision',
    findings: ['Incision edges approximated','Mild surrounding erythema','Small amount of serosanguineous drainage','No wound odor noted','Reports tenderness 3/10','Dressing changed per local order/protocol'],
    required: [['Incision',['approximated','incision'],14],['Skin',['erythema'],14],['Drainage',['serosanguineous','small amount','drainage'],16],['Odor',['no odor','odor'],10],['Tenderness',['tenderness','3/10'],12],['Care',['dressing changed'],12]],
    model: 'Lower abdominal incision with edges approximated and mild surrounding erythema. Small amount of serosanguineous drainage present; no odor noted. Patient reports tenderness 3/10. Dressing changed per applicable order/protocol.'
  },
  {
    id: 'cardio', level: 'B1', title: 'Cardiovascular Assessment', patient: '63-year-old patient reporting ankle swelling',
    findings: ['Alert and oriented','BP 132/78 mmHg · HR 84 bpm','Bilateral ankle edema','Skin warm','Capillary refill less than 3 seconds','Denies chest pain'],
    required: [['Vitals',['132/78','84'],12],['Edema',['edema','ankle','bilateral'],18],['Skin',['warm'],10],['Perfusion',['capillary refill','3 seconds'],16],['Chest pain',['denies chest pain','no chest pain'],12]],
    model: 'Patient alert and oriented. BP 132/78 mmHg and HR 84 bpm. Bilateral ankle edema noted. Skin warm with capillary refill less than 3 seconds. Patient denies chest pain.'
  },
  {
    id: 'mental-health', level: 'B2', title: 'Mental-Health Observation', patient: 'Adult patient admitted for acute behavioral-health evaluation',
    findings: ['Awake and alert','Pacing in room','Speech loud but coherent','Reports feeling anxious','Denies current intent to harm self or others','Accepts verbal redirection'],
    required: [['Behavior',['pacing'],14],['Speech',['loud','coherent'],14],['Mood symptom',['anxious','anxiety'],14],['Safety statement',['denies','harm self','harm others'],18],['Response',['redirection','accepts'],12]],
    model: 'Patient awake and alert, pacing in room. Speech loud but coherent. Reports feeling anxious. Denies current intent to harm self or others. Accepts verbal redirection.'
  },
  {
    id: 'trend', level: 'C1', title: 'Trend & Reassessment Note', patient: 'Patient reassessed after a change in respiratory status',
    findings: ['Initial RR 30/min and SpO₂ 91%','Repositioned upright and prescribed oxygen continued','Thirty minutes later RR 22/min and SpO₂ 95%','Patient reports less shortness of breath','Remains alert and oriented'],
    required: [['Initial status',['30','91%'],14],['Intervention',['reposition','upright','oxygen'],16],['Reassessment',['30 minutes','22','95%'],18],['Response',['less shortness of breath','improved','dyspnea'],16],['Mental status',['alert','oriented'],10]],
    model: 'Initial assessment: RR 30/min and SpO₂ 91%. Patient repositioned upright and prescribed oxygen continued. On reassessment 30 minutes later, RR decreased to 22/min and SpO₂ increased to 95%; patient reports less shortness of breath and remains alert and oriented.'
  },
  {
    id: 'capstone', level: 'C1', title: 'Integrated Nursing Note', patient: 'Postoperative patient with new respiratory symptoms',
    findings: ['Postoperative day 1','Reports new shortness of breath','RR increased from 18 to 28/min','SpO₂ decreased from 96% to 90% on room air','Speaking in short sentences','Provider/team notified per local escalation pathway'],
    required: [['Context',['postoperative','post-op','day 1'],12],['Symptom',['shortness of breath','dyspnea'],14],['Trend',['18','28','96%','90%'],20],['Communication',['short sentences'],12],['Escalation',['notified','escalation','provider','team'],16]],
    model: 'Postoperative day 1. Patient reports new shortness of breath. RR increased from 18 to 28/min and SpO₂ decreased from 96% to 90% on room air; patient speaking in short sentences. Findings escalated to the appropriate clinical team per local pathway.'
  },
];

export const tutorReplies = [
  { match:['dizziness','lightheaded'], answer:'Dizziness is broad. Lightheadedness usually means feeling faint, while vertigo commonly describes a spinning sensation. Ask the patient to describe the sensation rather than assuming the meaning.' },
  { match:['note','documentation','chart'], answer:'Strong clinical documentation is specific, objective and relevant. Include patient-reported symptoms, measurable findings, interventions, reassessment and response when applicable.' },
  { match:['sbar'], answer:'SBAR = Situation, Background, Assessment, Recommendation. Situation states the immediate concern; Background gives relevant context; Assessment communicates current findings; Recommendation states what is needed or requested within role and local policy.' },
  { match:['opqrst','pain'], answer:'OPQRST can structure symptom history: Onset, Provocation/Palliation, Quality, Region/Radiation, Severity and Time. Use it flexibly rather than as a rigid script.' },
  { match:['handoff'], answer:'A useful handoff emphasizes current status, relevant history, safety concerns, lines/tubes or therapies, mobility, pain, pending results/tasks and what the next clinician needs to follow up.' },
  { match:['objective','subjective'], answer:'Subjective information is reported by the patient, such as nausea or pain. Objective information is observed or measured, such as blood pressure, drainage or breath sounds.' },
  { match:['wound'], answer:'Describe what you can observe: location, approximation, surrounding skin, drainage amount and character, odor if assessed, pain/tenderness and dressing status. Avoid diagnosing infection from appearance alone.' },
  { match:['teach-back','education'], answer:'Teach-back checks how clearly information was explained. A useful phrase is: “To make sure I explained it clearly, can you tell me how you will do this at home?”' },
];

export default {
  contentVersion,
  levels,
  units,
  lessonQuestions,
  reviewWords,
  speakingPhrases,
  nursingCases,
  tutorReplies,
  questionCount: allQuestions.length,
  lessonCount: units.flatMap((u) => u.lessons).length,
};
