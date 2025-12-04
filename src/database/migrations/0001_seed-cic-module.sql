-- Custom SQL migration file, put your code below! --
-- Insert CIC module
INSERT INTO
  module (name, description, key, active, ord)
VALUES
  (
    'Cateterismos (CIC)',
    'Registro de cateterismos intermitentes limpios.',
    'cic',
    0,
    1
  );

-- Insert CIC fields
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
    'volumeLevel',
    NULL,
    'enum',
    '["low","normal","high"]',
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
    'color',
    NULL,
    'enum',
    '["transparent","light_yellow","dark_yellow","abnormal"]',
    1,
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
    'turbidity',
    NULL,
    'enum',
    '["clear","mild","high"]',
    1,
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
    'discomfortLevel',
    NULL,
    'enum',
    '["none","mild","pain"]',
    1,
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
    'notes',
    NULL,
    'string',
    NULL,
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
    'source',
    NULL,
    'enum',
    '["primary","secondary"]',
    1,
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
    'deviceId',
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
    'syncStatus',
    NULL,
    'enum',
    '["local_only","synced"]',
    1,
    8
  );
