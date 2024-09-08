# ZKard emissor

This is the actor that is tasked of emitting ntag424 cards and securing their
private keys, veryfing them when asked for and interacting with the abstract
account it owns (associated to the cards) in order to pay for what is asked

## Endpoints

- [x] POST /account/:pubKey/request
   Receives the proof from a card tap and validates it, if it is correct and
   the card has balance, makes a payment from the card Abstract Account to a
   specified receiver. Uses a General Paymaster for gas
- []  POST /ntag424
   Initializes a card, creating the private keys and also creating an abstract
   account interacting with the factory contract

## Usage

Use this as a template from github and follow the next steps before using:

1. Use the correct nvm version
```bash
nvm use
```
2. Copy the .env.example
```bash
cp .env.example .env
```
3. [Generate](https://nostrdebug.lacrypta.ar/publish) a nostr key pair and put
   it in the variables `NOSTR_PRIVATE_KEY` and `NOSTR_PUBLIC_KEY`

## Installation

```bash
pnpm i
```

## Testing

```bash
pnpm test
```

## Linting and prettier

```bash
pnpm lint
pnpm prettier
```

## Development Server

```bash
pnpm dev
```

## Docker Server

```bash
docker compose up
```
