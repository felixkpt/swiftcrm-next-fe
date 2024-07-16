import React from 'react';
import {
  IconButton,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RecordType } from '@/app/components/baseComponents/Autos/BaseAutoModel/types';

type Relationship = {
  type: string;
  relatedObject: string;
};

type RelationshipComponentProps = {
  relationships: Relationship[];
  setRelationships: React.Dispatch<React.SetStateAction<Relationship[]>>;
  autobuilderObjects: RecordType[];
};

const RelationshipComponent: React.FC<RelationshipComponentProps> = ({
  relationships,
  setRelationships,
  autobuilderObjects
}) => {

  const handleRelationshipChange = (index: number, updatedRelationship: Relationship) => {
    const updatedRelationships = [...relationships];
    updatedRelationships[index] = updatedRelationship;
    setRelationships(updatedRelationships);
  };

  const handleRemoveRelationship = (index: number) => {
    const updatedRelationships = relationships.filter((_, i) => i !== index);
    setRelationships(updatedRelationships);
  };

  const handleAddRelationship = () => {
    const updatedRelationships = [...relationships, { type: '', relatedObject: '' }];
    setRelationships(updatedRelationships);
  };

  console.log(autobuilderObjects)

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Relationships
      </Typography>

      {relationships.map((relationship, index) => (
        <Box key={index}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={5}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id={`type-select-label-${index}`}>Type</InputLabel>
                <Select
                  labelId={`type-select-label-${index}`}
                  id={`type-select-${index}`}
                  value={relationship.type}
                  onChange={(e) =>
                    handleRelationshipChange(index, {
                      ...relationship,
                      type: e.target.value
                    })
                  }
                  label="Type"
                >
                  <MenuItem value="one-to-one">One-to-One</MenuItem>
                  <MenuItem value="one-to-many">One-to-Many</MenuItem>
                  <MenuItem value="many-to-one">Many-to-One</MenuItem>
                  <MenuItem value="many-to-many">Many-to-Many</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id={`related-object-select-label-${index}`}>Related Object</InputLabel>
                <Select
                  labelId={`related-object-select-label-${index}`}
                  id={`related-object-select-${index}`}
                  value={relationship.relatedObject}
                  onChange={(e) =>
                    handleRelationshipChange(index, {
                      ...relationship,
                      relatedObject: e.target.value
                    })
                  }
                  label="Related Object"
                >
                  {autobuilderObjects.map((object) => (
                    <MenuItem key={object.id} value={object.id}>
                      {object.table_name_plural}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <IconButton aria-label="delete" onClick={() => handleRemoveRelationship(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}

      <Box mt={2}>
        <Button variant="outlined" onClick={handleAddRelationship}>
          Add Relationship
        </Button>
      </Box>
    </>
  );
};

export default RelationshipComponent;
