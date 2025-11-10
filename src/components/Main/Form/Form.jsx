import React, { useState, useContext, useEffect } from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ExpenseTrackerContext } from '../../../context/context';
import { v4 as uuidv4 } from 'uuid';
import { Mic, MicOff } from '@material-ui/icons';
import useSpeechRecognition from '../../../hooks/useSpeechToText.js';
import formatDate from '../../../utils/formatDate';
import useStyles from './styles';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import CustomizedSnackbar from '../../Snackbar/Snackbar';
import InfoCard from '../../InfoCard';

const initialState = {
    amount: '',
    category: '',
    type: 'Income',
    date: formatDate(new Date()),
};

const Form = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialState);
    const { addTransaction } = useContext(ExpenseTrackerContext);
    const [open, setOpen] = useState(false);

    const { transcript, listening, error, startListening, stopListening } = useSpeechRecognition();

    const createTransaction = () => {
        if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;
        const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() };
        setOpen(true);
        addTransaction(transaction);
        setFormData(initialState);
    };

    const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

    // 🧠 Parse speech and auto-fill form
    useEffect(() => {
        if (!transcript) return;

        const text = transcript.toLowerCase();

        // Type detection
        if (text.includes('expense')) setFormData((prev) => ({ ...prev, type: 'Expense' }));
        else if (text.includes('income')) setFormData((prev) => ({ ...prev, type: 'Income' }));

        // Amount extraction
        const amountMatch = text.match(/(\d+(\.\d+)?)/);
        if (amountMatch) {
            setFormData((prev) => ({ ...prev, amount: amountMatch[0] }));
        }

        // Category detection
        const allCategories = [...incomeCategories, ...expenseCategories];
        for (let c of allCategories) {
            const cat = c.type.toLowerCase();
            if (text.includes(cat)) {
                setFormData((prev) => ({ ...prev, category: c.type }));
                break;
            }
        }

        // Date detection
        if (text.includes('today')) {
            setFormData((prev) => ({ ...prev, date: formatDate(new Date()) }));
        }

        if (text.includes('yesterday')) {
            const yest = new Date();
            yest.setDate(yest.getDate() - 1);
            setFormData((prev) => ({ ...prev, date: formatDate(yest) }));
        }

        // Auto create on "add" or "create"
        if (text.includes('add') || text.includes('create')) {
            if (formData.amount && formData.category && formData.type && formData.date) {
                createTransaction();
            }
        }
    }, [transcript]); // runs whenever new speech is transcribed

    return (
        <Grid container spacing={2}>
            <CustomizedSnackbar open={open} setOpen={setOpen} />

            {/* MIC + TRANSCRIPTION */}
            <Grid item xs={12}>
                <Typography align="center" variant="subtitle2" gutterBottom style={{ color: 'rgba(25, 58, 116, 1)' }}>
                    {listening ? 'Listening...' : transcript || <InfoCard />}
                </Typography>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <Button
                        variant="contained"
                        color={listening ? 'secondary' : 'primary'}
                        startIcon={listening ? <MicOff /> : <Mic />}
                        onClick={listening ? stopListening : startListening}
                    >
                        {listening ? 'Stop' : 'Speak'}
                    </Button>
                </div>

                {error && <Typography color="error" align="center">{error}</Typography>}
            </Grid>

            {/* FORM INPUTS */}
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <MenuItem value="Income">Income</MenuItem>
                        <MenuItem value="Expense">Expense</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        {selectedCategories.map((c) => (
                            <MenuItem key={c.type} value={c.type}>
                                {c.type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                <TextField
                    fullWidth
                    type="number"
                    label="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })}
                />
            </Grid>

            <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>
                Create
            </Button>
        </Grid>
    );
};

export default Form;

