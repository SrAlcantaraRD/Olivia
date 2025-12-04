-- Custom SQL migration file, put your code below! --
-- Insert stool module
INSERT INTO
  module (name, description, key, active, ord)
VALUES
  (
    'Deposiciones',
    'Registro de deposiciones (caca) y patrón intestinal.',
    'stool',
    0,
    2
  );

-- Insert stool fields
INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'consistency',
    NULL,
    'enum',
    '["hard","normal","soft","diarrhea"]',
    1,
    1
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'amount',
    NULL,
    'enum',
    '["small","medium","large"]',
    0,
    2
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'color',
    NULL,
    'enum',
    '["brown","light_brown","dark_brown","green","black","other"]',
    0,
    3
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'effort',
    NULL,
    'enum',
    '["none","mild","high"]',
    0,
    4
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'pain',
    NULL,
    'enum',
    '["none","mild","pain"]',
    0,
    5
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'accident',
    NULL,
    'boolean',
    NULL,
    0,
    6
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'notes',
    NULL,
    'string',
    NULL,
    0,
    7
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'source',
    NULL,
    'enum',
    '["primary","secondary"]',
    1,
    8
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'deviceId',
    NULL,
    'string',
    NULL,
    0,
    9
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    last_insert_rowid(),
    'syncStatus',
    NULL,
    'enum',
    '["local_only","synced"]',
    1,
    10
  );
