const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 80;
const qs = require('qs');

// Define your API key (this should be stored securely, e.g., in an environment variable)
const API_KEY = process.env.RAGE_EFFECT_API_KEY;

// Middleware to check for API key
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Route to call an external API with POST request using wallet parameter from URL (requires authentication)
app.get('/user_info/wallet/:wallet', authenticate, async (req, res) => {
    const { wallet } = req.params;

    if (!wallet) {
        return res.status(400).json({ error: 'Wallet parameter is required' });
    }

    try {
        const data = qs.stringify({
            wallet: wallet});

        const response = await axios.post('https://api.rageeffect.io/php/user_wallet.php', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error calling external API', details: error.message });
    }
});

// Route to handle missing wallet parameter (requires authentication)
app.get('/user_info/user_wallet/', authenticate, async (req, res) => {
    return res.status(400).json({
        status: "error",
        message: 'Wallet address is required'
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
