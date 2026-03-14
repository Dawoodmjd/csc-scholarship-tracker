CREATE TABLE universities (
  university_id TEXT PRIMARY KEY,
  university_name TEXT NOT NULL,
  province_or_city TEXT,
  campuschina_host_listed TEXT CHECK (campuschina_host_listed IN ('Yes', 'No')),
  agency_number TEXT,
  top_bucket TEXT CHECK (top_bucket IN ('C9', '985_non_C9', '211_only', 'other')),
  is_c9 TEXT CHECK (is_c9 IN ('Yes', 'No')),
  is_985 TEXT CHECK (is_985 IN ('Yes', 'No')),
  is_211 TEXT CHECK (is_211 IN ('Yes', 'No')),
  international_admissions_url TEXT,
  csc_program_page_url TEXT,
  primary_source_url TEXT,
  source_last_checked TEXT,
  notes TEXT
);

CREATE TABLE programs (
  program_id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(university_id),
  university_name TEXT NOT NULL,
  degree_level TEXT CHECK (degree_level IN ('Masters', 'PhD', 'Master', 'Doctoral', 'PhD/Doctoral')),
  discipline_group TEXT,
  major_name TEXT NOT NULL,
  school_or_college TEXT,
  department_name TEXT,
  teaching_language TEXT,
  duration_years TEXT,
  tuition_cny_per_year TEXT,
  application_fee_cny TEXT,
  csc_type_b_supported TEXT CHECK (csc_type_b_supported IN ('Yes', 'No', 'Unknown')),
  accepts_csc_applicants TEXT CHECK (accepts_csc_applicants IN ('Yes', 'No', 'Unknown')),
  application_open_date TEXT,
  application_deadline TEXT,
  admissions_url TEXT,
  program_url TEXT,
  primary_source_url TEXT,
  source_last_checked TEXT,
  notes TEXT
);

CREATE TABLE program_requirements (
  requirement_id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(program_id),
  degree_level TEXT,
  requirement_name TEXT NOT NULL,
  required TEXT CHECK (required IN ('Yes', 'No', 'Depends')),
  details TEXT,
  source_url TEXT,
  source_last_checked TEXT,
  notes TEXT
);

CREATE TABLE collection_queue (
  queue_id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(university_id),
  university_name TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT CHECK (status IN ('Not started', 'In progress', 'Blocked', 'Completed')),
  target_scope TEXT,
  last_attempted_on TEXT,
  source_url TEXT,
  notes TEXT
);

