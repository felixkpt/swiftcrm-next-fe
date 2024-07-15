// FormBuilder.tsx
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Grid, Paper, Button } from '@mui/material';

const FormBuilder = () => {
  const [fields, setFields] = useState<Array<{ id: number; width: number; position: { x: number; y: number } }>>([]);

  const addField = () => {
    const newField = {
      id: fields.length,
      width: 12,
      position: { x: 0, y: 0 },
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: number, newWidth: number, newPosition: { x: number; y: number }) => {
    setFields(fields.map(field => (field.id === id ? { ...field, width: newWidth, position: newPosition } : field)));
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={addField}>
        Add Field
      </Button>
      <div style={{ position: 'relative', minHeight: '400px', marginTop: '20px', border: '1px solid #ccc', padding: '10px', background:'red' }}>
        <Grid container spacing={2}>
          {fields.map(field => (
            <Draggable
              key={field.id}
              bounds="parent"
              defaultPosition={field.position}
              onStop={(e, data) => updateField(field.id, field.width, { x: data.x, y: data.y })}
            >
              <Grid item xs={field.width} style={{ position: 'absolute', top: field.position.y, left: field.position.x }}>
                <Paper style={{ padding: '16px', width: '100%' }}>
                  <div>
                    <label>Field {field.id}</label>
                    <input type="text" style={{ width: '100%' }} />
                  </div>
                  <input
                    type="number"
                    value={field.width}
                    min="1"
                    max="12"
                    onChange={(e) => updateField(field.id, Number(e.target.value), field.position)}
                    style={{ marginTop: '8px', width: '100%' }}
                  />
                </Paper>
              </Grid>
            </Draggable>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default FormBuilder;
