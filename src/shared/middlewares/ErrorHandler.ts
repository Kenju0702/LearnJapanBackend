import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any, // Sử dụng any để linh hoạt với các loại lỗi khác nhau
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Kiểm tra môi trường để chỉ hiển thị chi tiết lỗi trong môi trường phát triển
  const isDev = process.env.NODE_ENV === 'development';

  // Ghi lỗi ra console
  console.error(err.stack || err); // In toàn bộ lỗi nếu không có stack

  // Xác định mã lỗi và thông báo lỗi phù hợp
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Trả về thông báo lỗi chi tiết trong môi trường phát triển
  const errorResponse = {
    message,
    stack: isDev ? err.stack : undefined, // Chỉ trả stack trace khi ở môi trường dev
    code: err.code || statusCode, // Có thể thêm mã lỗi tùy chỉnh
  };

  // Gửi phản hồi với mã lỗi và thông tin chi tiết
  res.status(statusCode).json(errorResponse);
};
