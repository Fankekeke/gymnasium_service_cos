package cc.mrbird.febs.cos.dao;

import cc.mrbird.febs.cos.entity.ReplyInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import java.util.LinkedHashMap;
import java.util.List;

/**
 * @author FanK
 */
public interface ReplyInfoMapper extends BaseMapper<ReplyInfo> {

    // 分页查询回复信息
    IPage<LinkedHashMap<String, Object>> replyInfoByPage(Page page, @Param("replyInfo") ReplyInfo replyInfo);

    // 获取具体的帖子回复信息
    List<LinkedHashMap<String, Object>> replyListByPostId(@Param("postId") Integer postId);

    /**
     * 获取用户回复信息
     *
     * @param userId 用户ID
     * @return 结果
     */
    List<LinkedHashMap<String, Object>> replyListByUserId(@Param("userId") Integer userId);
}
