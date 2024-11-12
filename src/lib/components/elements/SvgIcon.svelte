<!--
    BBA SvgIcon
    Developers: , Nejc 
    Example of use:
        <SvgIcon icon="close-white" size="md" fill="blue" />
-->
<script lang="ts">
	// import { isProduction, src, assets } from '$lib/services/utilities/general';
	import { assets } from '$app/paths';
	export let icon: string = '', // icon name from icons folder only.
		size: string | number = 'xs',
		sizeH: any = undefined,
		iconAlign: string = '', // for parent component of SvgIcon, like Button
		className = '',
		wrapperStyle = '',
		wrapperClass = '',
		coinCode: string = '', // if coinCode exists icon will be replaced with crypto coin logo
		coinAmount: string | number | undefined = undefined, // if coinCode exists icon will be replaced with crypto coin logo
		showCoinCode = coinCode != '' ? true : false, // will show coin code text next to icon
		text: string = '',
		fill: string = '',
		fiatAmountHide: boolean | undefined = undefined, // hide fiat amount and stablecoins
		fiatHide: boolean | undefined = undefined; // hide element instance completely if fiat

	$: _icon = icon;

	let isFiat = false;
	if ((fiatAmountHide && coinAmount != undefined) || fiatHide) {
		let c = coinCode.toLowerCase();
		if (c == 'usdc' || c == 'usdt' || c == 'usd' || c == 'eur') {
			coinAmount = '';
			isFiat = true;
		}
	}

	$: {
		coinCode = coinCode && typeof coinCode == 'string' ? coinCode.toLowerCase() : coinCode;
		if (coinCode && typeof coinCode == 'string' && coinCode.toLowerCase().startsWith('bb')) {
			coinCode = coinCode.substring(2);
		}
		//made compatible even if icon name passed with/wihtout .svg extension
		if (typeof coinCode == 'string') {
			_icon =
				coinCode == ''
					? _icon.replace(/\.svg+$/g, '')
					: 'crypto/' + coinCode.replace(/\.svg+$/g, '').toLowerCase();
			_icon = _icon.startsWith('/') ? _icon.substring(1) : _icon;
		}
	}

	//subfolder icons can be used by mentioning folder name like icon="crypto/btc"
	let _source = coinCode == '' ? `${assets}/content/icons/` : `${assets}/content/icons/crypto/`;
</script>

{#if (_icon || coinCode) && (!fiatHide || (fiatHide && !isFiat))}
	{#if showCoinCode || text != '' || coinAmount != undefined}
		<span class="d-flex ai-c nowrap {wrapperClass}" style={wrapperStyle || undefined}>
			<!-- {#key icon} -->
			{#if !_icon.includes('nopack')}
				<svg
					data-cache={'86400'}
					data-unique-ids="disabled"
					data-css-scoping="enabled"
					fill={fill ? fill : 'currentColor'}
					class="flex-shrink-0 {iconAlign} {typeof size == 'string' ? size : ''} {className}"
					style={typeof size == 'number'
						? `width:${size}px;max-height:${sizeH ? sizeH : size}px;`
						: undefined}
					{...$$restProps}
				>
					<use xlink:href={`${assets}/sprites-${process.env.__ICONSVERSION__}.svg#${_icon}`} />
				</svg>
			{:else}
				<svg
					data-cache={'3600'}
					data-src={`${_source}${_icon}.svg`}
					data-unique-ids="disabled"
					data-css-scoping="enabled"
					fill={fill ? fill : 'currentColor'}
					class="flex-shrink-0 {iconAlign} {typeof size == 'string' ? size : ''} {className}"
					style={typeof size == 'number'
						? `width:${size}px;max-height:${sizeH ? sizeH : size}px;`
						: undefined}
					{...$$restProps}
				/>
			{/if}
			<!-- {/key} -->
			<span class="ms-1 nowrap lh-normal fs90 mfs80"
				>{coinAmount != undefined ? coinAmount + ' ' : ''}{showCoinCode
					? coinCode.toUpperCase()
					: ''}{text}</span
			>
		</span>
	{:else}
		<!-- {#key icon} -->
		{#if !_icon.includes('nopack')}
			<svg
				data-cache={'86400'}
				data-unique-ids="disabled"
				data-css-scoping="enabled"
				fill={fill ? fill : 'currentColor'}
				class="flex-shrink-0 {iconAlign} {typeof size == 'string' ? size : ''} {className}"
				style={typeof size == 'number'
					? `width:${size}px;max-height:${sizeH ? sizeH : size}px;`
					: undefined}
				{...$$restProps}
			>
				<use xlink:href={`${assets}/sprites-${process.env.__ICONSVERSION__}.svg#${_icon}`} />
			</svg>
		{:else}
			<svg
				data-cache={'3600'}
				data-src={`${_source}${_icon}.svg`}
				data-unique-ids="disabled"
				data-css-scoping="enabled"
				fill={fill ? fill : 'currentColor'}
				class="flex-shrink-0 {iconAlign} {typeof size == 'string' ? size : ''} {className}"
				style={typeof size == 'number'
					? `width:${size}px;max-height:${sizeH ? sizeH : size}px;`
					: undefined}
				{...$$restProps}
			/>
		{/if}
		<!-- {/key} -->
	{/if}
{/if}

<style>
	.xxxxxs {
		width: 12px;
		flex-shrink: 0;
		height: 12px;
	}
	.xxxxs {
		width: 14px;
		flex-shrink: 0;
		height: 14px;
	}
	.xxxs {
		width: 16px;
		flex-shrink: 0;
		height: 16px;
	}
	.xxs {
		width: 18px;
		flex-shrink: 0;
		height: 18px;
	}
	.xs {
		width: 22px;
		flex-shrink: 0;
		height: 22px;
	}

	.sm {
		width: 32px;
		flex-shrink: 0;
		height: 32px;
	}

	.md {
		width: 45px;
		flex-shrink: 0;
		height: 45px;
	}

	.lg {
		width: 90px;
		flex-shrink: 0;
		height: 90px;
	}
	.xl {
		width: 120px;
		flex-shrink: 0;
		height: 120px;
	}
	.xxl {
		width: 160px;
		flex-shrink: 0;
		height: 160px;
	}

	.button-xs {
		width: auto;
		max-width: 12px;
		height: 12px;
		min-width: 12px;
	}
	.button-sm,
	:global(.btn > svg.sm) {
		width: auto;
		max-width: 15px;
		height: 15px;
		min-width: 15px;
	}
	.button-sm.left,
	.button-xs.left {
		margin-right: 6px;
	}
	.button-sm.right,
	.button-xs.right {
		margin-left: 6px;
	}
	.button-md {
		width: auto;
		max-width: 22px;
		height: 14px;
		min-width: 22px;
	}
	.button-lg {
		width: auto;
		max-width: 24px;
		height: 16px;
		min-width: 24px;
	}

	.left {
		margin-right: 5px;
	}
	.iconOnly.left {
		margin-right: 0;
	}

	.right {
		margin-left: 5px;
	}
	.iconOnly.right {
		margin-left: 1;
	}
</style>
