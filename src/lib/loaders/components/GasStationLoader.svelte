<script lang="ts">
	import { Tip } from '$lib/services/elements';
	import { Lineloader } from '$lib/services/loaders';
</script>

<div class="d-flex flex-column mt-4 gap-2 mb-4">
	<span class="t-6 mb-1 dt w100"
		>Gas Station
		<Tip title="Gas Station" text="Gas Station provides information about blockchains current conditions and transaction fees.">
			<span class="h6 mb-2 db">Blockchain Gas Prices</span>
			<p>"Gas" is a cost to initiate a transaction of coins between two wallet addresses.</p>
			<p>
				<b>ERC20</b> - Ethereum blockchain processes all stablecoins. Gas is measured in ETH units - GWEIs. Amount of GWEIs needed to make a transaction depends on current load of Ethereum network.
			</p>
			<p>
				<b>Bitcoin</b> - Bitcoin blockchain process only Bitcoins and its gas is measured in Satoshis. Amount of Satoshis needed to make a transaction depends on current load of Bitcoin network and size
				of transaction measured in bytes.
			</p>
			<p>Our gas price analytic will show you current and daily average gas prices.</p>
			<br />
			<span class="h6 mb-2 db">Your Gas Account</span>
			<p>Prepaid gas account is used to cover gas expenses along with any fees that might occur while initiating transactions.</p>
		</Tip>
	</span>

	<Lineloader height="50" contentR={25} />

	<span class="flex-break t-6 mb-1 dt w100 muted fs90">Gas Prices Tracker</span>

	<Lineloader height="100" contentR={5} />
</div>
