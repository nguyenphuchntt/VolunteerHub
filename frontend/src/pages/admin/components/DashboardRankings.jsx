
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { EmojiEvents, Comment, Favorite } from '@mui/icons-material';

const RankingCard = ({ title, icon, data, type, note }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200", height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{type === 'event' ? 'Tên sự kiện' : 'Người dùng'}</TableCell>
                <TableCell align="right">Số lượng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type !== 'event' && (
                            <Avatar 
                                sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: 'primary.main' }}
                            >
                                {(item.title || '?').charAt(0).toUpperCase()}
                            </Avatar>
                        )}
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {item.title}
                        </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                        label={item.value || 0} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={3} align="center">
                          <Typography variant="caption" color="text.secondary">Chưa có dữ liệu</Typography>
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {note && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block', fontStyle: 'italic' }}>
           {note}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardRankings = ({ topActiveUsers, topInteractiveUsers, topEvents }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Bảng xếp hạng
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
        <RankingCard 
            title="Người dùng tích cực nhất" 
            icon={<EmojiEvents sx={{ color: "orange" }} />}
            data={topActiveUsers} 
            type="user"
            note="Xếp hạng theo số sự kiện đã tham gia"
        />
        <RankingCard 
            title="Người dùng tương tác nhiều nhất" 
            icon={<Comment sx={{ color: "blue" }} />}
            data={topInteractiveUsers} 
            type="user"
            note="Xếp hạng theo số bài viết, bình luận và lượt thích"
        />
        <RankingCard 
            title="Sự kiện được yêu thích nhất" 
            icon={<Favorite sx={{ color: "red" }} />}
            data={topEvents} 
            type="event"
            note="Xếp hạng theo số lượt thích"
        />
      </Box>
    </Box>
  );
};

export default DashboardRankings;
