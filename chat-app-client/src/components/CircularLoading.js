import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './Circular.css'

export default function CircularIndeterminate() {
  return <main className='circular-loading'>    
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  </main>
}
