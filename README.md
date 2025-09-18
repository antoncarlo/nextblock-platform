# 🏦 NEXTBLOCK - Insurance Tokenization Platform

[![Deploy Status](https://img.shields.io/badge/Deploy-Live-brightgreen)](https://nextblock-platform.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Mainnet-blue)](https://ethereum.org/)
[![HyperLiquid](https://img.shields.io/badge/HyperLiquid-EVM-purple)](https://hyperliquid.xyz/)

> **Democratizziamo il mercato assicurativo tradizionale aprendo una nuova frontiera**

NEXTBLOCK è una piattaforma innovativa che trasforma i rischi assicurativi in asset digitali, permettendo a un mercato globale di investitori di finanziarli direttamente attraverso tecnologia blockchain multi-chain.

## 🚀 Funzionalità Principali

### 🔗 **Multi-Chain Architecture**
- **Ethereum Mainnet & Sepolia** - Sicurezza e compliance
- **HyperLiquid Mainnet & Testnet** - Trading ultra-veloce (microsecondi)
- **Cross-chain bridging** automatico
- **Network switching** seamless

### 💼 **Insurance Tokenization**
- **Risk-based tokenization** di portafogli assicurativi
- **Fractional ownership** per democratizzare l'accesso
- **Automated settlement** in 24-48 ore vs 30-90 giorni tradizionali
- **KYC/AML compliance** integrata

### 📊 **Advanced Analytics**
- **Real-time portfolio** tracking
- **Risk assessment** automatizzato
- **Performance metrics** dettagliate
- **Institutional dashboard** completa

### ⚡ **Ultra-Fast Trading**
- **Microsecond execution** su HyperLiquid
- **High-frequency trading** capabilities
- **Liquidity pools** ottimizzate
- **Gas fees** ultra-bassi (1 gwei)

## 🛠 Tecnologie Utilizzate

### **Frontend**
- **React 18** con Vite
- **Framer Motion** per animazioni
- **Tailwind CSS** per styling
- **Lucide React** per icone

### **Blockchain**
- **Ethers.js** per interazioni Web3
- **MetaMask** integration
- **Hardhat** per smart contracts
- **OpenZeppelin** per sicurezza

### **Smart Contracts**
- **InsuranceRiskToken.sol** - Tokenizzazione rischi
- **LiquidityPool.sol** - Gestione liquidità
- **HyperLiquidAdapter.sol** - Bridge cross-chain

## 📈 Metriche di Performance

| Metrica | Tradizionale | NEXTBLOCK | Miglioramento |
|---------|-------------|-----------|---------------|
| **Settlement Time** | 30-90 giorni | 24-48 ore | **60-80% più veloce** |
| **Costi Transazione** | 3-5% | 0.5-1% | **60-80% riduzione** |
| **Liquidità** | Limitata | 24/7 globale | **15-25% aumento** |
| **Accesso Minimo** | $100K+ | $1K | **99% democratizzazione** |

## 🔧 Test di Connettività

La piattaforma include una **suite di test completa** per verificare:

- ✅ **Wallet Connection** - MetaMask detection e connessione
- ✅ **RPC Connectivity** - Latency e accessibilità reti
- ✅ **Balance Retrieval** - Saldi cross-chain real-time
- ✅ **Network Switching** - Cambio rete automatico
- ✅ **Transaction Capabilities** - Gas estimation e signing

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- pnpm o npm
- MetaMask wallet

### Installazione

```bash
# Clone del repository
git clone https://github.com/antoncarlo/nextblock-platform.git
cd nextblock-platform

# Installazione dipendenze
pnpm install

# Avvio server di sviluppo
pnpm run dev

# Build per produzione
pnpm run build
```

### Configurazione Environment

```bash
# Copia il file di esempio
cp .env.example .env

# Configura le variabili
ETHEREUM_RPC_URL=your_ethereum_rpc
HYPERLIQUID_RPC_URL=your_hyperliquid_rpc
PRIVATE_KEY=your_private_key
```

## 🏗 Architettura del Progetto

```
nextblock-platform/
├── src/
│   ├── components/          # Componenti React
│   │   ├── Hero.jsx        # Landing page hero
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── PortfolioManager.jsx # Portfolio management
│   │   └── ConnectivityTestPanel.jsx # Test suite
│   ├── utils/              # Utilities
│   │   └── MultiChainConnectivity.js # Test framework
│   └── useWallet.js        # Wallet management hook
├── contracts/              # Smart contracts
│   ├── InsuranceRiskToken.sol
│   ├── LiquidityPool.sol
│   └── HyperLiquidAdapter.sol
├── scripts/                # Deployment scripts
└── docs/                   # Documentazione
```

## 🔐 Smart Contracts

### InsuranceRiskToken.sol
```solidity
// Tokenizzazione di rischi assicurativi con compliance
contract InsuranceRiskToken is ERC20, AccessControl {
    // KYC/AML enforcement
    // Fractional ownership
    // Automated settlement
}
```

### HyperLiquidAdapter.sol
```solidity
// Bridge per trading ultra-veloce su HyperLiquid
contract HyperLiquidAdapter {
    // Cross-chain bridging
    // Microsecond execution
    // Liquidity optimization
}
```

## 📊 Business Model

### **Revenue Streams**
1. **Transaction Fees** - 0.5% su ogni trade
2. **Management Fees** - 1% annuo su AUM
3. **Premium Services** - Analytics avanzate
4. **White Label** - Licensing per istituzioni

### **Target Market**
- **Mercato Totale**: $16T industria assicurativa globale
- **Mercato Indirizzabile**: $2.3T asset tokenizzabili
- **ROI Atteso**: 300-500% in 18 mesi

## 🌐 Network Support

| Network | Chain ID | Status | Use Case |
|---------|----------|--------|----------|
| **Ethereum Mainnet** | 1 | ✅ Live | Security & Compliance |
| **Sepolia Testnet** | 11155111 | ✅ Live | Development & Testing |
| **HyperLiquid Mainnet** | 998 | ✅ Live | Ultra-Fast Trading |
| **HyperLiquid Testnet** | 999 | ✅ Live | Testing & Development |

## 🤝 Contributing

Contributi sono benvenuti! Per contribuire:

1. Fork del repository
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 License

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per dettagli.

## 📞 Contatti

- **Email**: next.block@insurer.com
- **Website**: [nextblock-platform.vercel.app](https://nextblock-platform.vercel.app)
- **GitHub**: [antoncarlo/nextblock-platform](https://github.com/antoncarlo/nextblock-platform)

## 🙏 Acknowledgments

- **SettleMint** - Asset tokenization framework
- **HyperLiquid** - Ultra-fast trading infrastructure
- **OpenZeppelin** - Smart contract security
- **Ethereum Foundation** - Blockchain infrastructure

---

**⚡ Built with passion for the future of decentralized finance and insurance**

*Democratizing access to institutional-grade insurance investments through blockchain technology*
