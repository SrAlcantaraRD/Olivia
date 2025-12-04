-- Custom SQL migration file, put your code below! --
-- Insert medication module
INSERT INTO
  module (name, description, key, active, ord)
VALUES
  (
    'Medicación',
    'Registro de tomas de medicación relacionadas con el cuidado urológico o intestinal.',
    'medication',
    0,
    4
  );

-- Insert medication fields
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
    'name',
    NULL,
    'string',
    NULL,
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
    'dose',
    NULL,
    'string',
    NULL,
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
    'route',
    NULL,
    'enum',
    '["oral","rectal","other"]',
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
    'taken',
    NULL,
    'boolean',
    NULL,
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
    'reasonNotTaken',
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
    'notes',
    NULL,
    'string',
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
    'source',
    NULL,
    'enum',
    '["primary","secondary"]',
    1,
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
    'deviceId',
    NULL,
    'string',
    NULL,
    0,
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
    'syncStatus',
    NULL,
    'enum',
    '["local_only","synced"]',
    1,
    9
  );
