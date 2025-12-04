-- Custom SQL migration file, put your code below! --
-- Insert enema module
INSERT INTO
  module (name, description, key, active, ord)
VALUES
  (
    'Enemas',
    'Registro de enemas y su efecto.',
    'enema',
    0,
    3
  );

-- Insert enema fields
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
    'type',
    NULL,
    'enum',
    '["rectal","oral","other"]',
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
    'result',
    NULL,
    'enum',
    '["no_result","partial","complete"]',
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
    'tolerance',
    NULL,
    'enum',
    '["good","regular","poor"]',
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
    'pain',
    NULL,
    'enum',
    '["none","mild","pain"]',
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
