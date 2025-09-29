package cc.mrbird.febs.cos.service;

import cc.mrbird.febs.cos.entity.AgentInfo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.LinkedHashMap;

/**
 * 健身训练 service层
 *
 * @author FanK fan1ke2ke@gmail.com
 */
public interface IAgentInfoService extends IService<AgentInfo> {

    /**
     * 分页获取健身训练
     *
     * @param page      分页对象
     * @param agentInfo 健身训练
     * @return 结果
     */
    IPage<LinkedHashMap<String, Object>> queryAgentPage(Page<AgentInfo> page, AgentInfo agentInfo);

    /**
     * 主页数据
     *
     * @param enterpriseId 教练ID
     * @return 结果
     */
    LinkedHashMap<String, Object> homeData(Integer enterpriseId);
}
