<script lang="ts">
	const year = 2026;
</script>

<footer class="foot">
	<div class="foot__inner">
		<div class="foot__brand">
			<span class="foot__mark">КОДЕКС</span>
			<span class="foot__tag">направление → предмет → семестр → курс</span>
		</div>
		<div class="foot__meta">
			<span>Платформа подготовки · {year}</span>
			<a href="/">Направления</a>
		</div>
	</div>
</footer>

<style>
	.foot {
		margin-top: 4rem;
		background: var(--surface-dark);
		color: #e6e6e6;
	}
	.foot__inner {
		max-width: 1180px;
		margin: 0 auto;
		padding: 2.2rem 1.4rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.foot__mark {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1.6rem;
		color: #fff;
		display: block;
	}
	.foot__tag {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.06em;
		color: var(--lime);
	}
	.foot__meta {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: #9a9a9a;
		text-align: right;
	}
	.foot__meta a {
		color: #cfcfcf;
		text-decoration: none;
	}
	.foot__meta a:hover {
		color: var(--lime);
	}
</style>
