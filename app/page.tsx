'use client';
import React, {useState} from 'react';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify';
import {
    Button, Chip,
    Container,
    FormControl,
    Paper,
    Radio,
    RadioGroup,
    Slider,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Typography
} from '@mui/material';
import {Box} from '@mui/system';

interface GameRecord {
    id: number;
    timestamp: string;
    threshold: number;
    isGreater: boolean;
    result: number;
    won: boolean;
}

export default function DiceGame() {
    const [threshold, setThreshold] = useState(50);
    const [isGreater, setIsGreater] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [, setHasWon] = useState(false);
    const [gameId, setGameId] = useState(1);

    const formatTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };

    const handleThresholdChange = (_event: Event, newValue: number | number[]) => {
        setThreshold(newValue as number);
    };

    const handleConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsGreater(event.target.value === 'over');
    };

    const playGame = () => {
        const diceResult = Math.floor(Math.random() * 100) + 1;

        const playerWon = isGreater ? diceResult > threshold : diceResult < threshold;

        const gameRecord: GameRecord = {
            id: gameId,
            timestamp: formatTime(),
            threshold,
            isGreater,
            result: diceResult,
            won: playerWon
        };

        setResult(diceResult);
        setHasWon(playerWon);
        setShowResult(true);
        setGameId(prevId => prevId + 1);

        const toastFn = playerWon ? toast.success : toast.error;

        toastFn(playerWon ? "You won" : "You lost\nNumber was higher", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            closeButton: false,
            style: {
                width: '600px',
                height: '76px',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'pre-line',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                backgroundColor: playerWon ? '#2E7D32' : '#D32F2F',
                color: 'white',
            },
        });

        setGameHistory(prevHistory => {
            const newHistory = [gameRecord, ...prevHistory];
            if (newHistory.length > 10) {
                return newHistory.slice(0, 10);
            }
            return newHistory;
        });
    };

    return (
        <Container maxWidth="md">
            <ToastContainer
                style={{
                    width: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}
                toastClassName={() => 'toast-with-white-icon'}
            />
            <Paper elevation={3} sx={{p: 4, mt: 14, mb: 4}}>

                {showResult && (
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4}}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 320,
                                height: 200,
                                mb: 2,
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <Typography variant="h1" component="div">
                                {result}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{mb: 4}}>
                    <FormControl component="fieldset" sx={{mb: 2, width: '100%'}}>
                        <RadioGroup
                            row
                            name="condition"
                            value={isGreater ? 'over' : 'under'}
                            onChange={handleConditionChange}
                            sx={{justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Typography sx={{mr: 1}}>Under</Typography>
                            <Radio
                                value="under"
                                sx={{
                                    color: '#9C27B0',
                                    '&.Mui-checked': {color: '#9C27B0'},
                                    mr: 2,
                                    '& .MuiSvgIcon-root': {color: 'white'}
                                }}
                            />
                            <Typography sx={{mr: 1}}>Over</Typography>
                            <Radio
                                value="over"
                                sx={{
                                    color: '#9C27B0',
                                    '&.Mui-checked': {color: '#9C27B0'},
                                    '& .MuiSvgIcon-root': {color: 'white'}
                                }}
                            />
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{display: 'flex', justifyContent: 'center', width: '100%', mb: 2}}>
                        <Box sx={{width: 320, height: 62}}>
                            <Slider
                                value={threshold}
                                onChange={handleThresholdChange}
                                valueLabelDisplay="auto"
                                step={1}
                                marks={[
                                    {value: 0, label: ''},
                                    {value: 20, label: ''},
                                    {value: 40, label: ''},
                                    {value: 60, label: ''},
                                    {value: 80, label: ''},
                                    {value: 100, label: ''}
                                ]}
                                min={0}
                                max={100}
                                sx={{
                                    color: '#9C27B0',
                                    '& .MuiSlider-thumb': {
                                        width: 14,
                                        height: 14,
                                        color: 'white',
                                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                            boxShadow: '0 0 0 14px rgba(156, 39, 176, 0.2)',
                                        },
                                    },
                                    '& .MuiSlider-valueLabel': {
                                        color: 'white',
                                        backgroundColor: '#9C27B0',
                                    },
                                    '& .MuiSlider-mark': {
                                        backgroundColor: 'white',
                                    }
                                }}
                            />
                            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 0, mb: 1}}>
                                <Typography>0</Typography>
                                <Typography>100</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={playGame}
                            sx={{
                                width: '320px',
                                height: '42px',
                                backgroundColor: '#9C27B0',
                                borderRadius: '8px',
                                padding: '8px 22px',
                                position: 'relative',
                                '&:hover': {
                                    backgroundColor: '#8e24aa',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: 'white',
                                },
                            }}
                        >

                            PLAY
                        </Button>
                    </Box>
                </Box>

                <TableContainer component={Paper} sx={{mb: 2}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold'}}>Time</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Guess</TableCell>
                                <TableCell sx={{fontWeight: 'bold'}}>Result</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gameHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No records yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                gameHistory.map((game) => (
                                    <TableRow key={game.id}>
                                        <TableCell>{game.timestamp}</TableCell>
                                        <TableCell>
                                            {game.isGreater ? `Over ${game.threshold}` : `Under ${game.threshold}`}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={game.result}
                                                sx={{
                                                    backgroundColor: 'transparent',
                                                    color: game.won ? 'green' : 'red',
                                                    border: 'none',
                                                    fontWeight: 'bold',
                                                    '& .MuiSvgIcon-root': {
                                                        color: 'white',
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <style jsx global>{`
                .toast-with-white-icon .Toastify__toast-icon svg {
                    fill: white !important;
                }

            `}</style>
        </Container>
    );
}