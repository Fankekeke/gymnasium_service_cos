package cc.mrbird.febs.cos.service;

import cc.mrbird.febs.cos.entity.DeptInfo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.LinkedHashMap;

/**
 * @author FanK
 */
public interface IDeptInfoService extends IService<DeptInfo> {

    /**
     * 分页获取部门信息
     *
     * @param page     分页对象
     * @param deptInfo 部门信息
     * @return 结果
     */
    IPage<LinkedHashMap<String, Object>> selectDeptPage(Page<DeptInfo> page, DeptInfo deptInfo);
}
