import styles from './table-skeleton.module.css';
import skeletonBaseStyles from './skeleton.module.css';
import { randomUUID } from 'node:crypto';

interface TableSkeletonProps {
	readonly rows?: number;
	readonly columns?: number;
}

export default function TableSkeleton({
	rows = 5,
	columns = 3,
}: TableSkeletonProps) {
	return (
		<table className={styles.tableSkeleton}>
			<thead>
				<tr>
					{Array.from({ length: columns }).map(() => (
						<th key={randomUUID()}>
							<div className={`${skeletonBaseStyles.skeleton} ${styles.header}`} />
						</th>
					))}
				</tr>
			</thead>

			<tbody>
				{Array.from({ length: rows }).map(() => (
					<tr key={randomUUID()}>
						{Array.from({ length: columns }).map((_, colIndex) => {

							const getVariation = () => {
								if (colIndex % 3 === 0) {
									return styles.short;
								}
								if (colIndex % 3 === 1) {
									return styles.medium;
								}
								return styles.full;
							};

							const variation = getVariation();

							return (
								<td key={randomUUID()}>
									<div
										className={`${skeletonBaseStyles.skeleton} ${styles.cell} ${variation}`}
									/>
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}
