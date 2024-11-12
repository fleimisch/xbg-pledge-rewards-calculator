<script lang="ts">
	const LOCALHOST = 'http://localhost:5173';

	/** @type {import('./$types').PageData} */
	export let data;
	const iconFiles = data.iconFiles;

	function handleMouseOver(event: any) {
		event.currentTarget.classList.remove('mouseOff');
		event.currentTarget.classList.add('mouseOver');
	}

	function handleMouseLeave(event: any) {
		event.currentTarget.classList.remove('mouseOver');
		event.currentTarget.classList.add('mouseOff');
	}

	function handleClick(iconFile: any) {
		const iconName = iconFile.replace('src/assets/content/icons/', '').replace('.svg', '');
		if (navigator.clipboard) {
			let note: any = document.getElementById('note');
			if (!note) return;
			navigator.clipboard.writeText(iconName).then(
				() => {
					note.style.display = '';
				},
				(err) => {
					note.style.display = '';
				}
			);
			setTimeout(() => {
				note.style.display = 'none';
			}, 3000);
		} else {
			alert("Browser doesn't support clipboard");
		}
	}
</script>

<div
	id="note"
	style="display:none; position:fixed; top:0; left:0; width:100%; background:green; color:white; text-align:center; padding:10px; font-size:15px; font-weight:bold;"
>
	<span> Copied to clipboard successfully. </span>
</div>

<div class="content">
	<div class="desc">
		<h1>BBA Icons Package</h1>
		<p class="lead">Click on icons to copy path and name for use in BBA's "SvgIcon" components.</p>
	</div>
	<div class="icon-list">
		<div class="icon-results">
			{#each iconFiles as iconFile}
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<span class="icon-results__cell">
					<img
						src={`/icons/${iconFile.replace('src/assets/content/icons/', '')}`}
						alt={`${iconFile.replace('src/assets/content/icons/', '')}`}
					/>
					<span class="wb-all">{iconFile.replace('src/assets/content/icons/', '')}</span>
				</span>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		background: rgba(0, 0, 0, 0.1);
	}
	.content {
		max-width: 1366px;
		margin: 100px auto;
		text-align: center;
	}
	.icon-list {
		box-sizing: border-box;
		margin: 50px auto;
		padding-left: 30px;
		padding-right: 30px;
	}
	.icon-results {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
		grid-auto-rows: minmax(70px, auto);
		grid-gap: 0.5em;
	}
	.icon-results__cell {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: background-color 0.4s;
		cursor: pointer;
		border-radius: 8px;
		border: 2px solid transparent;
		box-sizing: border-box;
	}
	.icon-results__cell img {
		width: 50px;
		height: 50px;
	}
	.wb-all {
		word-break: break-all;
	}
	:global(.icon-results__cell.mouseOver) {
		display: none;
		animation-name: shadowIn;
		animation-duration: 0.3s;
		animation-fill-mode: forwards;
	}
	:global(.icon-results__cell.mouseOff),
	:global(.icon-results__cell) {
		animation-name: shadowOut;
		animation-duration: 0.6s;
		animation-fill-mode: forwards;
	}
	@keyframes shadowIn {
		from {
			box-shadow: 0;
		}
		to {
			box-shadow:
				0px 3px 6px 0px rgba(0, 0, 0, 0.1),
				0px 1px 3px 0px rgba(0, 0, 0, 0.08);
		}
	}
	@keyframes shadowOut {
		from {
			box-shadow:
				0px 3px 6px 0px rgba(0, 0, 0, 0.1),
				0px 1px 3px 0px rgba(0, 0, 0, 0.08);
		}

		to {
			box-shadow: 0;
		}
	}
</style>
