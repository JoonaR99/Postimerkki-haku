import React, { useRef, useState } from 'react';
import { Alert, Button, Card, CardContent, CardMedia, Container, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';

const App : React.FC = () : React.ReactElement =>{

  const lomakeRef = useRef<any>();
  const [postimerkit, setPostimerkit] = useState<any[]>([]);
  const [virhe, setVirhe] = useState<string>("");
  const [ilmoitus, setIlmoitus] = useState<String>("");

  const kaynnistaHaku = async (e : React.FormEvent) : Promise<void> => {

    e.preventDefault();

    try {
      
      let reitti : string = `/api/postimerkit?hakusana=${lomakeRef.current.hakusana.value}&kohde=${lomakeRef.current.kohde.value}`;

      const yhteys = await fetch(reitti);
      
      const data = await yhteys.json();

      if(lomakeRef.current.hakusana.value.length > 2){
      setPostimerkit(data);
      setVirhe("");
      setIlmoitus("");
      } 
      if(lomakeRef.current.hakusana.value.length <= 2){
        setVirhe("Liian lyhyt hakusana, hakusanan oltava vähintään 3 merkkiä pitkä.");
        setIlmoitus("");

      } else if(data.length === 0){
        setVirhe(`Hakusanalla "${lomakeRef.current.hakusana.value}" ei löytynyt yhtään postimerkkiä`);
        setIlmoitus("");

      }
      if(data.length > 40){
        setPostimerkit(data);
        setIlmoitus("Haulla löytyi yli 40 postimerkkiä, näytetään vain ensimmäiset 40. Ole hyvä ja tarkenna hakua.");

      }

    } catch (e : any) {
      setVirhe("Palvelimelle ei saada yhteyttä.");
      setIlmoitus("");
      }

  }


  return (
    <Container>
      <Typography variant='h5' >OPPIMISTEHTÄVÄ 8: POSTIMERKKIHAKU</Typography>

      <Paper 
        elevation={2}
        sx={{padding : 2}}
        ref={lomakeRef}
        component='form'
        onSubmit={kaynnistaHaku}
        >
        <Stack>

          <Grid container spacing={1}>

            <Grid item xs={10}>
              <TextField
                name='hakusana'
                variant='outlined'
                size='small'
                fullWidth={true}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                type='submit'
                variant='contained'
                size='large'
                fullWidth
              >Hae</Button>
            </Grid>

          </Grid>

          <FormControl>
            <FormLabel>Haun kohde</FormLabel>
              <RadioGroup
                row
                name='kohde'
                defaultValue={'asiasanat'}
              >
                <FormControlLabel value='asiasanat' control={<Radio />} label='Asiasanat' />
                <FormControlLabel value='merkinNimi' control={<Radio />} label='Merkin nimi' />
                <FormControlLabel value='taiteilija' control={<Radio />} label='Taiteilija' />
              </RadioGroup>
          </FormControl>

        </Stack>
      </Paper>

      {(Boolean(virhe))
      ? <Alert severity="error">{virhe}</Alert>
      :<Grid container  >{postimerkit.slice(0, 40).map((postimerkki, idx) => {
        return<Grid key={idx} item lg={3}> 
                <Card sx={{maxWidth: 200, marginTop: 1, marginBottom: 1}} >
                  <CardMedia component="img" image={postimerkki.kuvanUrl} alt="Postimerkin kuva" />
                  <CardContent>
                    <Typography gutterBottom variant='body2' >{postimerkki.merkinNimi}</Typography>
                    <Typography gutterBottom variant='body2' >{postimerkki.nimellisarvo} {postimerkki.valuutta}</Typography>
                    <Typography gutterBottom variant='body2' >{postimerkki.painosmaara} kpl</Typography>
                    <Typography gutterBottom variant='body2' >{postimerkki.taiteilija}</Typography>
                  </CardContent>
                </Card>
              </Grid> 
            })}
        </Grid>
      }
      <Typography>{ilmoitus}</Typography>
    </Container>
  );
}

export default App;
