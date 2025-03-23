import React from 'react';
import Card from '@/components/ui/Card';
import { useStakingStore } from '@/store/stakingState';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return `${date.getMonth() + 1}/${date.getDate()}`;
};

const AssetChart: React.FC = () => {
	const { stakingInfo, isLoading } = useStakingStore();

	// 데이터 포인트 계산
	const chartData = stakingInfo.history.map((entry) => ({
		date: formatDate(entry.date),
		staked: entry.staked,
		reward: entry.reward,
		total: entry.staked + entry.reward,
	}));

	if (isLoading) {
		return (
			<Card title="자산 추이" className="w-full">
				<div className="flex justify-center items-center h-48">
					<div className="loader w-8 h-8 border-4 border-t-neon-blue rounded-full animate-spin"></div>
				</div>
			</Card>
		);
	}

	return (
		<Card title="자산 추이" className="w-full">
			<div className="p-2">
				<div className="h-64 w-full">
					{chartData.length > 0 ? (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#333" />
								<XAxis dataKey="date" stroke="#999" tick={{ fill: '#999', fontSize: 12 }} />
								<YAxis stroke="#999" tick={{ fill: '#999', fontSize: 12 }} width={40} />
								<Tooltip
									contentStyle={{
										backgroundColor: '#111',
										borderColor: '#333',
										borderRadius: '4px',
										color: '#fff',
									}}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="staked"
									name="스테이킹"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={{ r: 3 }}
									activeDot={{ r: 5 }}
								/>
								<Line
									type="monotone"
									dataKey="reward"
									name="보상"
									stroke="#a855f7"
									strokeWidth={2}
									dot={{ r: 3 }}
									activeDot={{ r: 5 }}
								/>
								<Line
									type="monotone"
									dataKey="total"
									name="총액"
									stroke="#10b981"
									strokeWidth={2}
									dot={{ r: 3 }}
									activeDot={{ r: 5 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div className="flex justify-center items-center h-full">
							<p className="text-gray-400">스테이킹 기록이 없습니다.</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export default AssetChart;
