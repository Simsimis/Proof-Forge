![Web3](https://img.shields.io/badge/Web3-Decentralized-8A2BE2)
![Ethereum](https://img.shields.io/badge/Ethereum-Wallet%20Signature-3C3C3D)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Frontend](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FGSAP-orange)
![Identity](https://img.shields.io/badge/Focus-Decentralized%20Identity-blue)
![Crypto](https://img.shields.io/badge/Cryptography-Signature%20Verification-red)

Proof-Forge

Proof-Forge is a Web3 prototype that enables users to generate cryptographic proof of skill ownership using Ethereum wallet signatures.

The system allows users to connect a wallet (MetaMask), sign a challenge message, and generate a visual proof badge bound to their blockchain address.

This project explores decentralized identity, wallet-based authentication, and lightweight cryptographic verification in a frontend-first architecture.

Overview

Traditional platforms rely on centralized verification for skills and credentials.
Proof-Forge demonstrates an alternative approach:
	•	Identity is tied to a wallet address
	•	Ownership is proven via cryptographic signature
	•	No centralized authentication server is required

The result is a minimal Web3-native verification mechanism.

How It Works
	1.	User connects MetaMask wallet
	2.	A challenge message is generated
	3.	The wallet signs the message
	4.	The signature is verified against the public address
	5.	A visual proof badge is generated and tied to that address

This ensures:
	•	Message authenticity
	•	Address ownership validation
	•	Non-repudiation through cryptographic signature

  Architecture

Frontend-only prototype built with:
	•	HTML
	•	CSS
	•	GSAP (animations & UI transitions)
	•	ScrollTrigger
	•	Ethereum wallet provider (MetaMask)

Signature handling leverages Ethereum’s native signing standards.

Goals
	•	Demonstrate wallet-based skill verification
	•	Explore decentralized identity concepts
	•	Prototype visual proof artifacts
	•	Establish a base for future on-chain verification

  
