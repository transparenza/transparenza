import {
  GelatoRelay,
  CallWithERC2771Request,
  RelayResponse,
  TransactionStatusResponse
} from '@gelatonetwork/relay-sdk'
import { GELATO_RELAY_API_KEY, GELATO_RELAY_API_URL } from 'config'
import { Web3Provider } from '@ethersproject/providers'
import axios from 'axios'

enum TaskState {
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  WaitingForConfirmation = 'WaitingForConfirmation',
  Blacklisted = 'Blacklisted',
  Cancelled = 'Cancelled',
  NotFound = 'NotFound'
}

export const gelatoRelay = new GelatoRelay()
export const gelatoApiClient = axios.create({
  baseURL: GELATO_RELAY_API_URL
})

export const sponsoredCall = async (request: CallWithERC2771Request, provider: Web3Provider) => {
  return await gelatoRelay.sponsoredCallERC2771(request, provider, GELATO_RELAY_API_KEY)
}

const FETCH_INTERVAL = 4000
const MAX_ATTEMPTS = 60
export const awaitSponsoredCall = async (relayResponse: RelayResponse) :Promise<TransactionStatusResponse | undefined> => {
  let attempts = 0
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    console.log('attempt', attempts)
    if (attempts > MAX_ATTEMPTS) {
      throw new Error('Gelato relay timed out')
    }

    const task = await gelatoRelay.getTaskStatus(relayResponse.taskId)
    if (!task) {
      throw new Error('No response from Gelato Relay')
    }

    // SUCCESS
    if (task.taskState === TaskState.ExecSuccess) {
      return task
    }

    // FAILED
    if ([
      TaskState.ExecReverted,
      TaskState.Blacklisted,
      TaskState.Cancelled,
      TaskState.NotFound,
    ].includes(task.taskState)) {
      throw new Error('Gelato relay call failed', { cause: task })
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, FETCH_INTERVAL))
  }
}
