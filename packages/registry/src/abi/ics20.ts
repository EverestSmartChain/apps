/* eslint-disable no-secrets/no-secrets */

export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "granter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "methods",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "AllowanceChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "receiver",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourcePort",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourceChannel",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "denom",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "memo",
        type: "string",
      },
    ],
    name: "IBCTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "granter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourcePort",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "sourceChannel",
        type: "string",
      },
      {
        components: [
          {
            internalType: "string",
            name: "denom",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Coin[]",
        name: "spendLimit",
        type: "tuple[]",
      },
    ],
    name: "IBCTransferAuthorization",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "granter",
        type: "address",
      },
    ],
    name: "RevokeIBCTransferAuthorization",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        internalType: "address",
        name: "granter",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "sourcePort",
            type: "string",
          },
          {
            internalType: "string",
            name: "sourceChannel",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "denom",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct Coin[]",
            name: "spendLimit",
            type: "tuple[]",
          },
          {
            internalType: "string[]",
            name: "allowList",
            type: "string[]",
          },
        ],
        internalType: "struct Allocation[]",
        name: "allocations",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        components: [
          {
            internalType: "string",
            name: "sourcePort",
            type: "string",
          },
          {
            internalType: "string",
            name: "sourceChannel",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "denom",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct Coin[]",
            name: "spendLimit",
            type: "tuple[]",
          },
          {
            internalType: "string[]",
            name: "allowList",
            type: "string[]",
          },
        ],
        internalType: "struct Allocation[]",
        name: "allocations",
        type: "tuple[]",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        internalType: "string",
        name: "sourcePort",
        type: "string",
      },
      {
        internalType: "string",
        name: "sourceChannel",
        type: "string",
      },
      {
        internalType: "string",
        name: "denom",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trace",
        type: "string",
      },
    ],
    name: "denomHash",
    outputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "denomTrace",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "path",
            type: "string",
          },
          {
            internalType: "string",
            name: "baseDenom",
            type: "string",
          },
        ],
        internalType: "struct DenomTrace",
        name: "denomTrace",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "key",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "offset",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "limit",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "countTotal",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "reverse",
            type: "bool",
          },
        ],
        internalType: "struct PageRequest",
        name: "pageRequest",
        type: "tuple",
      },
    ],
    name: "denomTraces",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "path",
            type: "string",
          },
          {
            internalType: "string",
            name: "baseDenom",
            type: "string",
          },
        ],
        internalType: "struct DenomTrace[]",
        name: "denomTraces",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "nextKey",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "total",
            type: "uint64",
          },
        ],
        internalType: "struct PageResponse",
        name: "pageResponse",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        internalType: "string",
        name: "sourcePort",
        type: "string",
      },
      {
        internalType: "string",
        name: "sourceChannel",
        type: "string",
      },
      {
        internalType: "string",
        name: "denom",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
    ],
    name: "revoke",
    outputs: [
      {
        internalType: "bool",
        name: "revoked",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "sourcePort",
        type: "string",
      },
      {
        internalType: "string",
        name: "sourceChannel",
        type: "string",
      },
      {
        internalType: "string",
        name: "denom",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "string",
        name: "receiver",
        type: "string",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "revisionNumber",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "revisionHeight",
            type: "uint64",
          },
        ],
        internalType: "struct Height",
        name: "timeoutHeight",
        type: "tuple",
      },
      {
        internalType: "uint64",
        name: "timeoutTimestamp",
        type: "uint64",
      },
      {
        internalType: "string",
        name: "memo",
        type: "string",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "uint64",
        name: "nextSequence",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
